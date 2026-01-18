import { UserRole } from '@prisma/client';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto, UpdateEvaluationDto } from './dto';
export declare class EvaluationsController {
    private readonly evaluationsService;
    constructor(evaluationsService: EvaluationsService);
    create(user: {
        id: string;
    }, createEvaluationDto: CreateEvaluationDto): Promise<{
        student: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        evaluationDate: Date;
        weight: number;
        notes: string | null;
        studentId: string;
        height: number;
        bodyFat: number | null;
        chest: number | null;
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
    findAllByStudent(user: {
        id: string;
        role: UserRole;
    }, studentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        evaluationDate: Date;
        weight: number;
        notes: string | null;
        studentId: string;
        height: number;
        bodyFat: number | null;
        chest: number | null;
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
    getProgress(user: {
        id: string;
        role: UserRole;
    }, studentId: string): Promise<{
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
    findOne(user: {
        id: string;
        role: UserRole;
    }, id: string): Promise<{
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
        evaluationDate: Date;
        weight: number;
        notes: string | null;
        studentId: string;
        height: number;
        bodyFat: number | null;
        chest: number | null;
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
    update(user: {
        id: string;
    }, id: string, updateEvaluationDto: UpdateEvaluationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        evaluationDate: Date;
        weight: number;
        notes: string | null;
        studentId: string;
        height: number;
        bodyFat: number | null;
        chest: number | null;
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
    remove(user: {
        id: string;
    }, id: string): Promise<{
        message: string;
    }>;
}
