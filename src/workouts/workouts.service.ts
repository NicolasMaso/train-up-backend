import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma';
import { CreateWorkoutDto, UpdateWorkoutDto } from './dto';
import { StudentsService } from '../students/students.service';

@Injectable()
export class WorkoutsService {
  constructor(
    private prisma: PrismaService,
    private studentsService: StudentsService,
  ) {}

  async create(personalId: string, createWorkoutDto: CreateWorkoutDto) {
    const { name, description, studentId, trainingPlanId, exercises } =
      createWorkoutDto;

    // Verify student belongs to personal
    await this.studentsService.verifyStudentOwnership(personalId, studentId);

    // Create workout with exercises
    const workout = await this.prisma.workout.create({
      data: {
        name,
        description,
        studentId,
        personalId,
        trainingPlanId,
        exercises: {
          create: exercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            order: ex.order,
            sets: ex.sets,
            reps: ex.reps,
            restSeconds: ex.restSeconds,
            weight: ex.weight,
            notes: ex.notes,
          })),
        },
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: { order: 'asc' },
        },
        student: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return workout;
  }

  async findAllForPersonal(personalId: string, studentId?: string) {
    const where: { personalId: string; studentId?: string } = { personalId };
    if (studentId) {
      where.studentId = studentId;
    }

    return this.prisma.workout.findMany({
      where,
      include: {
        student: {
          select: { id: true, name: true },
        },
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllForStudent(studentId: string) {
    return this.prisma.workout.findMany({
      where: { studentId },
      include: {
        personal: {
          select: { id: true, name: true },
        },
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: { order: 'asc' },
        },
        trainingPlan: {
          select: { id: true, name: true, startDate: true, endDate: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, userRole: UserRole) {
    const workout = await this.prisma.workout.findUnique({
      where: { id },
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
        personal: {
          select: { id: true, name: true },
        },
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    // Check access
    if (userRole === UserRole.PERSONAL && workout.personalId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (userRole === UserRole.STUDENT && workout.studentId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return workout;
  }

  async update(
    personalId: string,
    id: string,
    updateWorkoutDto: UpdateWorkoutDto,
  ) {
    const workout = await this.prisma.workout.findUnique({
      where: { id },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    if (workout.personalId !== personalId) {
      throw new ForbiddenException('Access denied');
    }

    const { name, description, exercises } = updateWorkoutDto;

    // If exercises are provided, replace all
    if (exercises) {
      // Delete existing exercises
      await this.prisma.workoutExercise.deleteMany({
        where: { workoutId: id },
      });

      // Update workout with new exercises
      return this.prisma.workout.update({
        where: { id },
        data: {
          name,
          description,
          exercises: {
            create: exercises.map((ex) => ({
              exerciseId: ex.exerciseId,
              order: ex.order,
              sets: ex.sets,
              reps: ex.reps,
              restSeconds: ex.restSeconds,
              weight: ex.weight,
              notes: ex.notes,
            })),
          },
        },
        include: {
          exercises: {
            include: {
              exercise: true,
            },
            orderBy: { order: 'asc' },
          },
        },
      });
    }

    return this.prisma.workout.update({
      where: { id },
      data: {
        name,
        description,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async markAsCompleted(id: string, studentId: string) {
    const workout = await this.prisma.workout.findUnique({
      where: { id },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    if (workout.studentId !== studentId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.workout.update({
      where: { id },
      data: {
        completedAt: new Date(),
      },
    });
  }

  async remove(personalId: string, id: string) {
    const workout = await this.prisma.workout.findUnique({
      where: { id },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    if (workout.personalId !== personalId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.workout.delete({
      where: { id },
    });

    return { message: 'Workout deleted successfully' };
  }

  // Obter planos de treino prestes a expirar (próximos X dias)
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
}
