import { Request as ExpressRequest } from 'express';
import { UserRole } from '@prisma/client';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto, CreateResponseDto } from './dto';
interface AuthenticatedRequest extends ExpressRequest {
    user: {
        sub: string;
        email: string;
        role: UserRole;
    };
}
export declare class FeedbackController {
    private readonly feedbackService;
    constructor(feedbackService: FeedbackService);
    create(req: AuthenticatedRequest, createFeedbackDto: CreateFeedbackDto): Promise<{
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
    findAll(req: AuthenticatedRequest, status?: string): Promise<({
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
    findOne(req: AuthenticatedRequest, id: string): Promise<{
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
    addResponse(req: AuthenticatedRequest, id: string, createResponseDto: CreateResponseDto): Promise<{
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
    resolve(req: AuthenticatedRequest, id: string): Promise<{
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
    reopen(req: AuthenticatedRequest, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        workoutId: string;
        message: string;
        status: import("@prisma/client").$Enums.FeedbackStatus;
        resolvedAt: Date | null;
    }>;
}
export {};
