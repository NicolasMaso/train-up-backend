import { UserRole } from '@prisma/client';
import { TrainingPlansService } from './training-plans.service';
import { CreateTrainingPlanDto } from './dto';
export declare class TrainingPlansController {
    private readonly trainingPlansService;
    constructor(trainingPlansService: TrainingPlansService);
    create(user: {
        id: string;
    }, createDto: CreateTrainingPlanDto): Promise<{
        student: {
            id: string;
            name: string;
            email: string;
        };
        workouts: ({
            exercises: ({
                exercise: {
                    id: string;
                    name: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    externalId: string | null;
                    instructions: string | null;
                    gifUrl: string | null;
                    videoUrl: string | null;
                    muscleGroup: string | null;
                    secondaryMuscles: string | null;
                    equipment: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                order: number;
                sets: number;
                reps: string;
                restSeconds: number | null;
                weight: string | null;
                notes: string | null;
                exerciseId: string;
                workoutId: string;
            })[];
        } & {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            personalId: string;
            completedAt: Date | null;
            trainingPlanId: string | null;
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        personalId: string;
    }>;
    getExpiring(user: {
        id: string;
    }, days?: string): Promise<({
        student: {
            id: string;
            name: string;
            email: string;
            avatar: string | null;
        };
        workouts: {
            id: string;
            name: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        personalId: string;
    })[]>;
    findAll(user: {
        id: string;
        role: UserRole;
    }, studentId?: string): Promise<({
        personal: {
            id: string;
            name: string;
        };
        workouts: ({
            exercises: ({
                exercise: {
                    id: string;
                    name: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    externalId: string | null;
                    instructions: string | null;
                    gifUrl: string | null;
                    videoUrl: string | null;
                    muscleGroup: string | null;
                    secondaryMuscles: string | null;
                    equipment: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                order: number;
                sets: number;
                reps: string;
                restSeconds: number | null;
                weight: string | null;
                notes: string | null;
                exerciseId: string;
                workoutId: string;
            })[];
        } & {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            personalId: string;
            completedAt: Date | null;
            trainingPlanId: string | null;
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        personalId: string;
    })[] | ({
        student: {
            id: string;
            name: string;
            avatar: string | null;
        };
        workouts: {
            id: string;
            name: string;
            _count: {
                exercises: number;
            };
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        personalId: string;
    })[]>;
    findOne(user: {
        id: string;
        role: UserRole;
    }, id: string): Promise<{
        student: {
            id: string;
            name: string;
            email: string;
        };
        personal: {
            id: string;
            name: string;
        };
        workouts: ({
            exercises: ({
                exercise: {
                    id: string;
                    name: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    externalId: string | null;
                    instructions: string | null;
                    gifUrl: string | null;
                    videoUrl: string | null;
                    muscleGroup: string | null;
                    secondaryMuscles: string | null;
                    equipment: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                order: number;
                sets: number;
                reps: string;
                restSeconds: number | null;
                weight: string | null;
                notes: string | null;
                exerciseId: string;
                workoutId: string;
            })[];
        } & {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            personalId: string;
            completedAt: Date | null;
            trainingPlanId: string | null;
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        personalId: string;
    }>;
    remove(user: {
        id: string;
    }, id: string): Promise<{
        message: string;
    }>;
    toggleActive(user: {
        id: string;
    }, id: string): Promise<{
        message: string;
        isActive: boolean;
    }>;
}
