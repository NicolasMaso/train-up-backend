import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma';
import { CreateEvaluationDto, UpdateEvaluationDto } from './dto';
import { StudentsService } from '../students/students.service';
export declare class EvaluationsService {
    private prisma;
    private studentsService;
    constructor(prisma: PrismaService, studentsService: StudentsService);
    create(personalId: string, createEvaluationDto: CreateEvaluationDto): Promise<{
        student: {
            id: string;
            name: string;
            email: string;
        };
    } & {
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
    }>;
    findAllByStudent(studentId: string, userId: string, userRole: UserRole): Promise<{
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
    }[]>;
    findOne(id: string, userId: string, userRole: UserRole): Promise<{
        student: {
            id: string;
            name: string;
            email: string;
            personalId: string | null;
        };
    } & {
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
    }>;
    getProgress(studentId: string, userId: string, userRole: UserRole): Promise<{
        evaluations: {
            id: string;
            evaluationDate: Date;
            weight: number;
            bodyFat: number | null;
            bmi: number | null;
        }[];
        progress: null;
        message: string;
    } | {
        evaluations: {
            id: string;
            evaluationDate: Date;
            weight: number;
            bodyFat: number | null;
            bmi: number | null;
        }[];
        progress: {
            weightChange: number;
            bodyFatChange: number | null;
            bmiChange: number | null;
            periodDays: number;
        };
        message?: undefined;
    }>;
    update(personalId: string, id: string, updateEvaluationDto: UpdateEvaluationDto): Promise<{
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
    }>;
    remove(personalId: string, id: string): Promise<{
        message: string;
    }>;
}
