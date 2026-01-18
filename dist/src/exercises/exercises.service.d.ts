import { PrismaService } from '../prisma';
import { CreateExerciseDto, UpdateExerciseDto } from './dto';
export declare class ExercisesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createExerciseDto: CreateExerciseDto): Promise<{
        id: string;
        externalId: string | null;
        name: string;
        description: string | null;
        instructions: string | null;
        gifUrl: string | null;
        videoUrl: string | null;
        muscleGroup: string | null;
        secondaryMuscles: string | null;
        equipment: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(muscleGroup?: string): Promise<{
        id: string;
        externalId: string | null;
        name: string;
        description: string | null;
        instructions: string | null;
        gifUrl: string | null;
        videoUrl: string | null;
        muscleGroup: string | null;
        secondaryMuscles: string | null;
        equipment: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        externalId: string | null;
        name: string;
        description: string | null;
        instructions: string | null;
        gifUrl: string | null;
        videoUrl: string | null;
        muscleGroup: string | null;
        secondaryMuscles: string | null;
        equipment: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateExerciseDto: UpdateExerciseDto): Promise<{
        id: string;
        externalId: string | null;
        name: string;
        description: string | null;
        instructions: string | null;
        gifUrl: string | null;
        videoUrl: string | null;
        muscleGroup: string | null;
        secondaryMuscles: string | null;
        equipment: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
