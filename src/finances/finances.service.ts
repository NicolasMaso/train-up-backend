import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserRole, PaymentStatus } from '@prisma/client';
import { PrismaService } from '../prisma';
import { CreatePaymentDto, UpdatePaymentDto } from './dto';
import { StudentsService } from '../students/students.service';

@Injectable()
export class FinancesService {
  constructor(
    private prisma: PrismaService,
    private studentsService: StudentsService,
  ) {}

  async createPayment(personalId: string, createPaymentDto: CreatePaymentDto) {
    const { studentId, amount, dueDate, description } = createPaymentDto;

    // Verify student belongs to personal
    await this.studentsService.verifyStudentOwnership(personalId, studentId);

    return this.prisma.payment.create({
      data: {
        studentId,
        personalId,
        amount,
        dueDate: new Date(dueDate),
        description,
        status: PaymentStatus.PENDING,
      },
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async findAllForPersonal(personalId: string, studentId?: string, status?: PaymentStatus) {
    const where: { personalId: string; studentId?: string; status?: PaymentStatus } = { personalId };
    if (studentId) where.studentId = studentId;
    if (status) where.status = status;

    const payments = await this.prisma.payment.findMany({
      where,
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { dueDate: 'desc' },
    });

    // Calculate summary
    const summary = await this.getFinancialSummary(personalId);

    return { payments, summary };
  }

  async findAllForStudent(studentId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { studentId },
      include: {
        personal: {
          select: { id: true, name: true },
        },
      },
      orderBy: { dueDate: 'desc' },
    });

    const pending = payments
      .filter((p) => p.status === PaymentStatus.PENDING)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const overdue = payments
      .filter((p) => p.status === PaymentStatus.OVERDUE)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      payments,
      summary: {
        pendingAmount: pending,
        overdueAmount: overdue,
        totalDue: pending + overdue,
      },
    };
  }

  async getFinancialSummary(personalId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { personalId },
    });

    const pending = payments
      .filter((p) => p.status === PaymentStatus.PENDING)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const overdue = payments
      .filter((p) => p.status === PaymentStatus.OVERDUE)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const paid = payments
      .filter((p) => p.status === PaymentStatus.PAID)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    // Get this month's revenue
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyRevenue = payments
      .filter((p) => p.status === PaymentStatus.PAID && p.paidDate && p.paidDate >= startOfMonth)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      pendingAmount: pending,
      overdueAmount: overdue,
      totalReceived: paid,
      monthlyRevenue,
      totalStudentsWithPendingPayments: await this.prisma.payment.groupBy({
        by: ['studentId'],
        where: { personalId, status: { in: [PaymentStatus.PENDING, PaymentStatus.OVERDUE] } },
      }).then((groups) => groups.length),
    };
  }

  async findOne(id: string, userId: string, userRole: UserRole) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
        personal: {
          select: { id: true, name: true },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Check access
    if (userRole === UserRole.STUDENT && payment.studentId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (userRole === UserRole.PERSONAL && payment.personalId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return payment;
  }

  async update(personalId: string, id: string, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.personalId !== personalId) {
      throw new ForbiddenException('Access denied');
    }

    const { dueDate, paidDate, ...data } = updatePaymentDto;

    return this.prisma.payment.update({
      where: { id },
      data: {
        ...data,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        paidDate: paidDate ? new Date(paidDate) : undefined,
      },
      include: {
        student: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async markAsPaid(id: string, userId: string, userRole: UserRole) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Both student and personal can mark as paid
    if (userRole === UserRole.STUDENT && payment.studentId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (userRole === UserRole.PERSONAL && payment.personalId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.PAID,
        paidDate: new Date(),
      },
    });
  }

  async remove(personalId: string, id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.personalId !== personalId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.payment.delete({
      where: { id },
    });

    return { message: 'Payment deleted successfully' };
  }

  // Cron job to update overdue payments (can be called periodically)
  async updateOverduePayments() {
    const now = new Date();
    
    await this.prisma.payment.updateMany({
      where: {
        status: PaymentStatus.PENDING,
        dueDate: { lt: now },
      },
      data: {
        status: PaymentStatus.OVERDUE,
      },
    });
  }
}
