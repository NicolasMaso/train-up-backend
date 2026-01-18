import { UserRole } from '@prisma/client';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto, UpdateWorkoutDto } from './dto';
export declare class WorkoutsController {
    private readonly workoutsService;
    constructor(workoutsService: WorkoutsService);
    create(user: {
        id: string;
    }, createWorkoutDto: CreateWorkoutDto): Promise<{
        exercises: ({
            exercise: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            exerciseId: string;
            order: number;
            sets: number;
            reps: string;
            restSeconds: number | null;
            weight: string | null;
            notes: string | null;
            workoutId: string;
        })[];
        student: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        personalId: string;
        scheduledDate: Date | null;
        studentId: string;
        expiresAt: Date | null;
        completedAt: Date | null;
    }>;
    getExpiring(user: {
        id: string;
    }, days?: string): Promise<({
        exercises: ({
            exercise: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            exerciseId: string;
            order: number;
            sets: number;
            reps: string;
            restSeconds: number | null;
            weight: string | null;
            notes: string | null;
            workoutId: string;
        })[];
        student: {
            id: string;
            name: string;
            email: string;
            avatar: string | null;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        personalId: string;
        scheduledDate: Date | null;
        studentId: string;
        expiresAt: Date | null;
        completedAt: Date | null;
    })[]>;
    findAll(user: {
        id: string;
        role: UserRole;
    }, studentId?: string): Promise<({
        exercises: ({
            exercise: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            exerciseId: string;
            order: number;
            sets: number;
            reps: string;
            restSeconds: number | null;
            weight: string | null;
            notes: string | null;
            workoutId: string;
        })[];
        personal: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        personalId: string;
        scheduledDate: Date | null;
        studentId: string;
        expiresAt: Date | null;
        completedAt: Date | null;
    })[] | ({
        exercises: ({
            exercise: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            exerciseId: string;
            order: number;
            sets: number;
            reps: string;
            restSeconds: number | null;
            weight: string | null;
            notes: string | null;
            workoutId: string;
        })[];
        student: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        personalId: string;
        scheduledDate: Date | null;
        studentId: string;
        expiresAt: Date | null;
        completedAt: Date | null;
    })[]>;
    findOne(user: {
        id: string;
        role: UserRole;
    }, id: string): Promise<{
        exercises: ({
            exercise: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            exerciseId: string;
            order: number;
            sets: number;
            reps: string;
            restSeconds: number | null;
            weight: string | null;
            notes: string | null;
            workoutId: string;
        })[];
        personal: {
            id: string;
            name: string;
        };
        student: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        personalId: string;
        scheduledDate: Date | null;
        studentId: string;
        expiresAt: Date | null;
        completedAt: Date | null;
    }>;
    update(user: {
        id: string;
    }, id: string, updateWorkoutDto: UpdateWorkoutDto): Promise<{
        exercises: ({
            exercise: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            exerciseId: string;
            order: number;
            sets: number;
            reps: string;
            restSeconds: number | null;
            weight: string | null;
            notes: string | null;
            workoutId: string;
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        personalId: string;
        scheduledDate: Date | null;
        studentId: string;
        expiresAt: Date | null;
        completedAt: Date | null;
    }>;
    markAsCompleted(user: {
        id: string;
    }, id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        personalId: string;
        scheduledDate: Date | null;
        studentId: string;
        expiresAt: Date | null;
        completedAt: Date | null;
    }>;
    remove(user: {
        id: string;
    }, id: string): Promise<{
        message: string;
    }>;
}
