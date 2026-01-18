import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma';
import { CreateTrainingPlanDto, UpdateTrainingPlanDto } from './dto';
import { StudentsService } from '../students/students.service';

@Injectable()
export class TrainingPlansService {
  constructor(
    private prisma: PrismaService,
    private studentsService: StudentsService,
  ) {}

  async create(personalId: string, createDto: CreateTrainingPlanDto) {
    const { name, description, studentId, startDate, endDate, workouts } =
      createDto;

    // Verify student belongs to personal
    await this.studentsService.verifyStudentOwnership(personalId, studentId);

    // Create training plan with workouts
    const trainingPlan = await this.prisma.trainingPlan.create({
      data: {
        name,
        description,
        studentId,
        personalId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        workouts: {
          create: workouts.map((workout) => ({
            name: workout.name,
            description: workout.description,
            studentId,
            personalId,
            exercises: {
              create: workout.exercises.map((ex) => ({
                exerciseId: ex.exerciseId,
                order: ex.order,
                sets: ex.sets,
                reps: ex.reps,
                restSeconds: ex.restSeconds,
                weight: ex.weight,
                notes: ex.notes,
              })),
            },
          })),
        },
      },
      include: {
        workouts: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
              orderBy: { order: 'asc' },
            },
          },
        },
        student: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return trainingPlan;
  }

  async findAllForPersonal(personalId: string, studentId?: string) {
    const where: { personalId: string; studentId?: string } = { personalId };
    if (studentId) {
      where.studentId = studentId;
    }

    return this.prisma.trainingPlan.findMany({
      where,
      include: {
        student: {
          select: { id: true, name: true, avatar: true },
        },
        workouts: {
          select: {
            id: true,
            name: true,
            _count: {
              select: { exercises: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllForStudent(studentId: string) {
    const now = new Date();

    return this.prisma.trainingPlan.findMany({
      where: {
        studentId,
        endDate: { gte: now }, // Only active plans
      },
      include: {
        personal: {
          select: { id: true, name: true },
        },
        workouts: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(id: string, userId: string, userRole: UserRole) {
    const trainingPlan = await this.prisma.trainingPlan.findUnique({
      where: { id },
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
        personal: {
          select: { id: true, name: true },
        },
        workouts: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!trainingPlan) {
      throw new NotFoundException('Training plan not found');
    }

    // Check access
    if (userRole === UserRole.PERSONAL && trainingPlan.personalId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (userRole === UserRole.STUDENT && trainingPlan.studentId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return trainingPlan;
  }

  async remove(personalId: string, id: string) {
    const trainingPlan = await this.prisma.trainingPlan.findUnique({
      where: { id },
    });

    if (!trainingPlan) {
      throw new NotFoundException('Training plan not found');
    }

    if (trainingPlan.personalId !== personalId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.trainingPlan.delete({
      where: { id },
    });

    return { message: 'Training plan deleted successfully' };
  }

  // Get expiring training plans (next X days)
  async getExpiring(personalId: string, daysAhead: number = 7) {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return this.prisma.trainingPlan.findMany({
      where: {
        personalId,
        endDate: {
          gte: now,
          lte: futureDate,
        },
      },
      include: {
        student: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        workouts: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { endDate: 'asc' },
    });
  }

  async toggleActive(personalId: string, id: string) {
    const trainingPlan = await this.prisma.trainingPlan.findUnique({
      where: { id },
    });

    if (!trainingPlan) {
      throw new NotFoundException('Training plan not found');
    }

    if (trainingPlan.personalId !== personalId) {
      throw new ForbiddenException('Access denied');
    }

    const updated = await this.prisma.trainingPlan.update({
      where: { id },
      data: { isActive: !trainingPlan.isActive },
    });

    return {
      message: updated.isActive
        ? 'Training plan activated'
        : 'Training plan deactivated',
      isActive: updated.isActive,
    };
  }
}
