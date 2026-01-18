import { PrismaService } from '../prisma';
import { CreateFeedbackDto, CreateResponseDto } from './dto';
import { FeedbackStatus, UserRole } from '@prisma/client';
export declare class FeedbackService {
    private prisma;
    constructor(prisma: PrismaService);
    create(studentId: string, createFeedbackDto: CreateFeedbackDto): Promise<{
        workout: {
            id: string;
            name: string;
        };
        student: {
            id: string;
            name: string;
            email: string;
        };
        responses: ({
            personal: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            personalId: string;
            message: string;
            feedbackId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        workoutId: string;
        message: string;
        status: import("@prisma/client").$Enums.FeedbackStatus;
        resolvedAt: Date | null;
    }>;
    findAllByPersonal(personalId: string, status?: FeedbackStatus): Promise<({
        workout: {
            id: string;
            name: string;
        };
        student: {
            id: string;
            name: string;
            email: string;
            avatar: string | null;
        };
        responses: ({
            personal: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            personalId: string;
            message: string;
            feedbackId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        workoutId: string;
        message: string;
        status: import("@prisma/client").$Enums.FeedbackStatus;
        resolvedAt: Date | null;
    })[]>;
    findAllByStudent(studentId: string): Promise<({
        workout: {
            id: string;
            name: string;
        };
        responses: ({
            personal: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            personalId: string;
            message: string;
            feedbackId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        workoutId: string;
        message: string;
        status: import("@prisma/client").$Enums.FeedbackStatus;
        resolvedAt: Date | null;
    })[]>;
    findOne(id: string, userId: string, userRole: UserRole): Promise<{
        workout: {
            id: string;
            name: string;
            personalId: string;
        };
        student: {
            id: string;
            name: string;
            email: string;
            avatar: string | null;
        };
        responses: ({
            personal: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            personalId: string;
            message: string;
            feedbackId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        workoutId: string;
        message: string;
        status: import("@prisma/client").$Enums.FeedbackStatus;
        resolvedAt: Date | null;
    }>;
    addResponse(feedbackId: string, personalId: string, createResponseDto: CreateResponseDto): Promise<{
        personal: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        personalId: string;
        message: string;
        feedbackId: string;
    }>;
    resolve(feedbackId: string, personalId: string): Promise<{
        workout: {
            id: string;
            name: string;
        };
        student: {
            id: string;
            name: string;
            email: string;
        };
        responses: ({
            personal: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            personalId: string;
            message: string;
            feedbackId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        workoutId: string;
        message: string;
        status: import("@prisma/client").$Enums.FeedbackStatus;
        resolvedAt: Date | null;
    }>;
    reopen(feedbackId: string, personalId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        workoutId: string;
        message: string;
        status: import("@prisma/client").$Enums.FeedbackStatus;
        resolvedAt: Date | null;
    }>;
    countOpenByPersonal(personalId: string): Promise<number>;
}
