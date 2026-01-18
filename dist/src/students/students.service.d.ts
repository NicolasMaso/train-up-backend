import { PrismaService } from '../prisma';
import { CreateStudentDto, UpdateStudentDto } from './dto';
export declare class StudentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(personalId: string, createStudentDto: CreateStudentDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    findAll(personalId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        _count: {
            evaluations: number;
            studentWorkouts: number;
        };
        email: string;
        phone: string | null;
        avatar: string | null;
    }[]>;
    findOne(personalId: string, studentId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        anamnesis: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            studentId: string;
            medicalConditions: string | null;
            medications: string | null;
            allergies: string | null;
            previousInjuries: string | null;
            surgeries: string | null;
            occupation: string | null;
            sleepHours: number | null;
            stressLevel: number | null;
            smokingHabit: boolean;
            alcoholConsumption: string | null;
            mainGoal: string | null;
            secondaryGoals: string | null;
            exerciseExperience: string | null;
            currentActivityLevel: string | null;
            dietaryRestrictions: string | null;
            mealsPerDay: number | null;
            waterIntakeLiters: number | null;
        }[];
        email: string;
        phone: string | null;
        avatar: string | null;
        evaluations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            chest: number | null;
            evaluationDate: Date;
            weight: number;
            notes: string | null;
            studentId: string;
            height: number;
            bodyFat: number | null;
            waist: number | null;
            hip: number | null;
            leftArm: number | null;
            rightArm: number | null;
            leftThigh: number | null;
            rightThigh: number | null;
            leftCalf: number | null;
            rightCalf: number | null;
            restingHeartRate: number | null;
            bloodPressure: string | null;
            bmi: number | null;
        }[];
        studentWorkouts: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            personalId: string;
            studentId: string;
            trainingPlanId: string | null;
            completedAt: Date | null;
        }[];
    }>;
    update(personalId: string, studentId: string, updateStudentDto: UpdateStudentDto): Promise<{
        id: string;
        name: string;
        updatedAt: Date;
        email: string;
        phone: string | null;
        avatar: string | null;
    }>;
    remove(personalId: string, studentId: string): Promise<{
        message: string;
    }>;
    verifyStudentOwnership(personalId: string, studentId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        avatar: string | null;
        personalId: string | null;
    }>;
}
