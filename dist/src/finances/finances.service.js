"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_1 = require("../prisma");
const students_service_1 = require("../students/students.service");
let FinancesService = class FinancesService {
    prisma;
    studentsService;
    constructor(prisma, studentsService) {
        this.prisma = prisma;
        this.studentsService = studentsService;
    }
    async createPayment(personalId, createPaymentDto) {
        const { studentId, amount, dueDate, description } = createPaymentDto;
        await this.studentsService.verifyStudentOwnership(personalId, studentId);
        return this.prisma.payment.create({
            data: {
                studentId,
                personalId,
                amount,
                dueDate: new Date(dueDate),
                description,
                status: client_1.PaymentStatus.PENDING,
            },
            include: {
                student: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    }
    async findAllForPersonal(personalId, studentId, status) {
        const where = { personalId };
        if (studentId)
            where.studentId = studentId;
        if (status)
            where.status = status;
        const payments = await this.prisma.payment.findMany({
            where,
            include: {
                student: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { dueDate: 'desc' },
        });
        const summary = await this.getFinancialSummary(personalId);
        return { payments, summary };
    }
    async findAllForStudent(studentId) {
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
            .filter((p) => p.status === client_1.PaymentStatus.PENDING)
            .reduce((sum, p) => sum + Number(p.amount), 0);
        const overdue = payments
            .filter((p) => p.status === client_1.PaymentStatus.OVERDUE)
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
    async getFinancialSummary(personalId) {
        const payments = await this.prisma.payment.findMany({
            where: { personalId },
        });
        const pending = payments
            .filter((p) => p.status === client_1.PaymentStatus.PENDING)
            .reduce((sum, p) => sum + Number(p.amount), 0);
        const overdue = payments
            .filter((p) => p.status === client_1.PaymentStatus.OVERDUE)
            .reduce((sum, p) => sum + Number(p.amount), 0);
        const paid = payments
            .filter((p) => p.status === client_1.PaymentStatus.PAID)
            .reduce((sum, p) => sum + Number(p.amount), 0);
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyRevenue = payments
            .filter((p) => p.status === client_1.PaymentStatus.PAID && p.paidDate && p.paidDate >= startOfMonth)
            .reduce((sum, p) => sum + Number(p.amount), 0);
        return {
            pendingAmount: pending,
            overdueAmount: overdue,
            totalReceived: paid,
            monthlyRevenue,
            totalStudentsWithPendingPayments: await this.prisma.payment.groupBy({
                by: ['studentId'],
                where: { personalId, status: { in: [client_1.PaymentStatus.PENDING, client_1.PaymentStatus.OVERDUE] } },
            }).then((groups) => groups.length),
        };
    }
    async findOne(id, userId, userRole) {
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
            throw new common_1.NotFoundException('Payment not found');
        }
        if (userRole === client_1.UserRole.STUDENT && payment.studentId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (userRole === client_1.UserRole.PERSONAL && payment.personalId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return payment;
    }
    async update(personalId, id, updatePaymentDto) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.personalId !== personalId) {
            throw new common_1.ForbiddenException('Access denied');
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
    async markAsPaid(id, userId, userRole) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (userRole === client_1.UserRole.STUDENT && payment.studentId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (userRole === client_1.UserRole.PERSONAL && payment.personalId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.payment.update({
            where: { id },
            data: {
                status: client_1.PaymentStatus.PAID,
                paidDate: new Date(),
            },
        });
    }
    async remove(personalId, id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.personalId !== personalId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        await this.prisma.payment.delete({
            where: { id },
        });
        return { message: 'Payment deleted successfully' };
    }
    async updateOverduePayments() {
        const now = new Date();
        await this.prisma.payment.updateMany({
            where: {
                status: client_1.PaymentStatus.PENDING,
                dueDate: { lt: now },
            },
            data: {
                status: client_1.PaymentStatus.OVERDUE,
            },
        });
    }
};
exports.FinancesService = FinancesService;
exports.FinancesService = FinancesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService,
        students_service_1.StudentsService])
], FinancesService);
//# sourceMappingURL=finances.service.js.map