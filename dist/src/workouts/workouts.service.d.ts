import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma';
import { CreateWorkoutDto, UpdateWorkoutDto } from './dto';
import { StudentsService } from '../students/students.service';
export declare class WorkoutsService {
    private prisma;
    private studentsService;
    constructor(prisma: PrismaService, studentsService: StudentsService);
    create(personalId: string, createWorkoutDto: CreateWorkoutDto): Promise<{
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
        studentId: string;
        trainingPlanId: string | null;
        completedAt: Date | null;
    }>;
    findAllForPersonal(personalId: string, studentId?: string): Promise<({
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
        studentId: string;
        trainingPlanId: string | null;
        completedAt: Date | null;
    })[]>;
    findAllForStudent(studentId: string): Promise<({
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
        trainingPlan: {
            id: string;
            name: string;
            startDate: Date;
            endDate: Date;
        } | null;
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
        studentId: string;
        trainingPlanId: string | null;
        completedAt: Date | null;
    })[]>;
    findOne(id: string, userId: string, userRole: UserRole): Promise<{
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
        studentId: string;
        trainingPlanId: string | null;
        completedAt: Date | null;
    }>;
    update(personalId: string, id: string, updateWorkoutDto: UpdateWorkoutDto): Promise<{
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
        studentId: string;
        trainingPlanId: string | null;
        completedAt: Date | null;
    }>;
    markAsCompleted(id: string, studentId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        personalId: string;
        studentId: string;
        trainingPlanId: string | null;
        completedAt: Date | null;
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
        createdAt: Date;
        updatedAt: Date;
        personalId: string;
        studentId: string;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    })[]>;
}
