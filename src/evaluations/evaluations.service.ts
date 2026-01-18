import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma';
import { CreateEvaluationDto, UpdateEvaluationDto } from './dto';
import { StudentsService } from '../students/students.service';

@Injectable()
export class EvaluationsService {
  constructor(
    private prisma: PrismaService,
    private studentsService: StudentsService,
  ) {}

  async create(personalId: string, createEvaluationDto: CreateEvaluationDto) {
    const { studentId, weight, height, evaluationDate, ...data } = createEvaluationDto;

    // Verify student belongs to personal
    await this.studentsService.verifyStudentOwnership(personalId, studentId);

    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = Number((weight / (heightInMeters * heightInMeters)).toFixed(2));

    return this.prisma.evaluation.create({
      data: {
        studentId,
        weight,
        height,
        bmi,
        evaluationDate: evaluationDate ? new Date(evaluationDate) : new Date(),
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

    return this.prisma.evaluation.findMany({
      where: { studentId },
      orderBy: { evaluationDate: 'desc' },
    });
  }

  async findOne(id: string, userId: string, userRole: UserRole) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id },
      include: {
        student: {
          select: { id: true, name: true, email: true, personalId: true },
        },
      },
    });

    if (!evaluation) {
      throw new NotFoundException('Evaluation not found');
    }

    // Check access
    if (userRole === UserRole.STUDENT && evaluation.studentId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (userRole === UserRole.PERSONAL && evaluation.student.personalId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return evaluation;
  }

  async getProgress(studentId: string, userId: string, userRole: UserRole) {
    // Check access
    if (userRole === UserRole.STUDENT && studentId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (userRole === UserRole.PERSONAL) {
      await this.studentsService.verifyStudentOwnership(userId, studentId);
    }

    const evaluations = await this.prisma.evaluation.findMany({
      where: { studentId },
      orderBy: { evaluationDate: 'asc' },
      select: {
        id: true,
        weight: true,
        bodyFat: true,
        bmi: true,
        evaluationDate: true,
      },
    });

    if (evaluations.length < 2) {
      return {
        evaluations,
        progress: null,
        message: 'Not enough evaluations to calculate progress',
      };
    }

    const first = evaluations[0];
    const last = evaluations[evaluations.length - 1];

    return {
      evaluations,
      progress: {
        weightChange: Number((last.weight - first.weight).toFixed(2)),
        bodyFatChange: first.bodyFat && last.bodyFat 
          ? Number((last.bodyFat - first.bodyFat).toFixed(2)) 
          : null,
        bmiChange: first.bmi && last.bmi 
          ? Number((last.bmi - first.bmi).toFixed(2)) 
          : null,
        periodDays: Math.floor(
          (last.evaluationDate.getTime() - first.evaluationDate.getTime()) / (1000 * 60 * 60 * 24)
        ),
      },
    };
  }

  async update(personalId: string, id: string, updateEvaluationDto: UpdateEvaluationDto) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id },
      include: {
        student: {
          select: { personalId: true },
        },
      },
    });

    if (!evaluation) {
      throw new NotFoundException('Evaluation not found');
    }

    if (evaluation.student.personalId !== personalId) {
      throw new ForbiddenException('Access denied');
    }

    const { weight, height, ...data } = updateEvaluationDto;
    
    // Recalculate BMI if weight or height changed
    let bmi = evaluation.bmi;
    const newWeight = weight ?? evaluation.weight;
    const newHeight = height ?? evaluation.height;
    
    if (weight || height) {
      const heightInMeters = newHeight / 100;
      bmi = Number((newWeight / (heightInMeters * heightInMeters)).toFixed(2));
    }

    return this.prisma.evaluation.update({
      where: { id },
      data: {
        weight: newWeight,
        height: newHeight,
        bmi,
        ...data,
      },
    });
  }

  async remove(personalId: string, id: string) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id },
      include: {
        student: {
          select: { personalId: true },
        },
      },
    });

    if (!evaluation) {
      throw new NotFoundException('Evaluation not found');
    }

    if (evaluation.student.personalId !== personalId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.evaluation.delete({
      where: { id },
    });

    return { message: 'Evaluation deleted successfully' };
  }
}
