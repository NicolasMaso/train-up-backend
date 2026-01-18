import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma';
import { CreateAnamnesisDto, UpdateAnamnesisDto } from './dto';
import { StudentsService } from '../students/students.service';

@Injectable()
export class AnamnesisService {
  constructor(
    private prisma: PrismaService,
    private studentsService: StudentsService,
  ) {}

  async create(personalId: string, createAnamnesisDto: CreateAnamnesisDto) {
    const { studentId, ...data } = createAnamnesisDto;

    // Verify student belongs to personal
    await this.studentsService.verifyStudentOwnership(personalId, studentId);

    return this.prisma.anamnesis.create({
      data: {
        studentId,
        ...data,
      },
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async findAllByStudent(studentId: string, userId: string, userRole: UserRole) {
    // Check access
    if (userRole === UserRole.STUDENT && studentId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (userRole === UserRole.PERSONAL) {
      await this.studentsService.verifyStudentOwnership(userId, studentId);
    }

    return this.prisma.anamnesis.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, userRole: UserRole) {
    const anamnesis = await this.prisma.anamnesis.findUnique({
      where: { id },
      include: {
        student: {
          select: { id: true, name: true, email: true, personalId: true },
        },
      },
    });

    if (!anamnesis) {
      throw new NotFoundException('Anamnesis not found');
    }

    // Check access
    if (userRole === UserRole.STUDENT && anamnesis.studentId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (userRole === UserRole.PERSONAL && anamnesis.student.personalId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return anamnesis;
  }

  async update(personalId: string, id: string, updateAnamnesisDto: UpdateAnamnesisDto) {
    const anamnesis = await this.prisma.anamnesis.findUnique({
      where: { id },
      include: {
        student: {
          select: { personalId: true },
        },
      },
    });

    if (!anamnesis) {
      throw new NotFoundException('Anamnesis not found');
    }

    if (anamnesis.student.personalId !== personalId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.anamnesis.update({
      where: { id },
      data: updateAnamnesisDto,
    });
  }

  async remove(personalId: string, id: string) {
    const anamnesis = await this.prisma.anamnesis.findUnique({
      where: { id },
      include: {
        student: {
          select: { personalId: true },
        },
      },
    });

    if (!anamnesis) {
      throw new NotFoundException('Anamnesis not found');
    }

    if (anamnesis.student.personalId !== personalId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.anamnesis.delete({
      where: { id },
    });

    return { message: 'Anamnesis deleted successfully' };
  }
}
