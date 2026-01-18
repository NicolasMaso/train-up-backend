import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma';
import { CreateTrainingPlanDto } from './dto';
import { StudentsService } from '../students/students.service';
export declare class TrainingPlansService {
    private prisma;
    private studentsService;
    constructor(prisma: PrismaService, studentsService: StudentsService);
    create(personalId: string, createDto: CreateTrainingPlanDto): Promise<{
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
    findAllForPersonal(personalId: string, studentId?: string): Promise<({
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
    findAllForStudent(studentId: string): Promise<({
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
    })[]>;
    findOne(id: string, userId: string, userRole: UserRole): Promise<{
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
    remove(personalId: string, id: string): Promise<{
        message: string;
    }>;
    getExpiring(personalId: string, daysAhead?: number): Promise<({
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
    toggleActive(personalId: string, id: string): Promise<{
        message: string;
        isActive: boolean;
    }>;
}
