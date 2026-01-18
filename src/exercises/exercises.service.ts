import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateExerciseDto, UpdateExerciseDto } from './dto';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async create(createExerciseDto: CreateExerciseDto) {
    return this.prisma.exercise.create({
      data: createExerciseDto,
    });
  }

  async findAll(muscleGroup?: string) {
    return this.prisma.exercise.findMany({
      where: muscleGroup ? { muscleGroup } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    return exercise;
  }

  async update(id: string, updateExerciseDto: UpdateExerciseDto) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    return this.prisma.exercise.update({
      where: { id },
      data: updateExerciseDto,
    });
  }

  async remove(id: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    await this.prisma.exercise.delete({
      where: { id },
    });

    return { message: 'Exercise deleted successfully' };
  }
}
