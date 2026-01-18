"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../prisma");
const client_1 = require("@prisma/client");
let FeedbackService = class FeedbackService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(studentId, createFeedbackDto) {
        const { workoutId, message } = createFeedbackDto;
        const workout = await this.prisma.workout.findUnique({
            where: { id: workoutId },
        });
        if (!workout) {
            throw new common_1.NotFoundException('Treino não encontrado');
        }
        if (workout.studentId !== studentId) {
            throw new common_1.ForbiddenException('Você não pode dar feedback para este treino');
        }
        return this.prisma.workoutFeedback.create({
            data: {
                workoutId,
                studentId,
                message,
            },
            include: {
                workout: {
                    select: { id: true, name: true },
                },
                student: {
                    select: { id: true, name: true, email: true },
                },
                responses: {
                    include: {
                        personal: {
                            select: { id: true, name: true },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
    }
    async findAllByPersonal(personalId, status) {
        return this.prisma.workoutFeedback.findMany({
            where: {
                workout: {
                    personalId,
                },
                ...(status && { status }),
            },
            include: {
                workout: {
                    select: { id: true, name: true },
                },
                student: {
                    select: { id: true, name: true, email: true, avatar: true },
                },
                responses: {
                    include: {
                        personal: {
                            select: { id: true, name: true },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAllByStudent(studentId) {
        return this.prisma.workoutFeedback.findMany({
            where: { studentId },
            include: {
                workout: {
                    select: { id: true, name: true },
                },
                responses: {
                    include: {
                        personal: {
                            select: { id: true, name: true },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId, userRole) {
        const feedback = await this.prisma.workoutFeedback.findUnique({
            where: { id },
            include: {
                workout: {
                    select: { id: true, name: true, personalId: true },
                },
                student: {
                    select: { id: true, name: true, email: true, avatar: true },
                },
                responses: {
                    include: {
                        personal: {
                            select: { id: true, name: true },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!feedback) {
            throw new common_1.NotFoundException('Feedback não encontrado');
        }
        if (userRole === client_1.UserRole.STUDENT && feedback.studentId !== userId) {
            throw new common_1.ForbiddenException('Você não tem acesso a este feedback');
        }
        if (userRole === client_1.UserRole.PERSONAL && feedback.workout.personalId !== userId) {
            throw new common_1.ForbiddenException('Você não tem acesso a este feedback');
        }
        return feedback;
    }
    async addResponse(feedbackId, personalId, createResponseDto) {
        const feedback = await this.prisma.workoutFeedback.findUnique({
            where: { id: feedbackId },
            include: {
                workout: true,
            },
        });
        if (!feedback) {
            throw new common_1.NotFoundException('Feedback não encontrado');
        }
        if (feedback.workout.personalId !== personalId) {
            throw new common_1.ForbiddenException('Você não pode responder este feedback');
        }
        return this.prisma.workoutFeedbackResponse.create({
            data: {
                feedbackId,
                personalId,
                message: createResponseDto.message,
            },
            include: {
                personal: {
                    select: { id: true, name: true },
                },
            },
        });
    }
    async resolve(feedbackId, personalId) {
        const feedback = await this.prisma.workoutFeedback.findUnique({
            where: { id: feedbackId },
            include: {
                workout: true,
            },
        });
        if (!feedback) {
            throw new common_1.NotFoundException('Feedback não encontrado');
        }
        if (feedback.workout.personalId !== personalId) {
            throw new common_1.ForbiddenException('Você não pode resolver este feedback');
        }
        return this.prisma.workoutFeedback.update({
            where: { id: feedbackId },
            data: {
                status: client_1.FeedbackStatus.RESOLVED,
                resolvedAt: new Date(),
            },
            include: {
                workout: {
                    select: { id: true, name: true },
                },
                student: {
                    select: { id: true, name: true, email: true },
                },
                responses: {
                    include: {
                        personal: {
                            select: { id: true, name: true },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
    }
    async reopen(feedbackId, personalId) {
        const feedback = await this.prisma.workoutFeedback.findUnique({
            where: { id: feedbackId },
            include: {
                workout: true,
            },
        });
        if (!feedback) {
            throw new common_1.NotFoundException('Feedback não encontrado');
        }
        if (feedback.workout.personalId !== personalId) {
            throw new common_1.ForbiddenException('Você não pode reabrir este feedback');
        }
        return this.prisma.workoutFeedback.update({
            where: { id: feedbackId },
            data: {
                status: client_1.FeedbackStatus.OPEN,
                resolvedAt: null,
            },
        });
    }
    async countOpenByPersonal(personalId) {
        return this.prisma.workoutFeedback.count({
            where: {
                status: client_1.FeedbackStatus.OPEN,
                workout: {
                    personalId,
                },
            },
        });
    }
};
exports.FeedbackService = FeedbackService;
exports.FeedbackService = FeedbackService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], FeedbackService);
//# sourceMappingURL=feedback.service.js.map