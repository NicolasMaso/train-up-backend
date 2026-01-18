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
exports.TrainingPlansService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_1 = require("../prisma");
const students_service_1 = require("../students/students.service");
let TrainingPlansService = class TrainingPlansService {
    prisma;
    studentsService;
    constructor(prisma, studentsService) {
        this.prisma = prisma;
        this.studentsService = studentsService;
    }
    async create(personalId, createDto) {
        const { name, description, studentId, startDate, endDate, workouts } = createDto;
        await this.studentsService.verifyStudentOwnership(personalId, studentId);
        const trainingPlan = await this.prisma.trainingPlan.create({
            data: {
                name,
                description,
                studentId,
                personalId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                workouts: {
                    create: workouts.map((workout) => ({
                        name: workout.name,
                        description: workout.description,
                        studentId,
                        personalId,
                        exercises: {
                            create: workout.exercises.map((ex) => ({
                                exerciseId: ex.exerciseId,
                                order: ex.order,
                                sets: ex.sets,
                                reps: ex.reps,
                                restSeconds: ex.restSeconds,
                                weight: ex.weight,
                                notes: ex.notes,
                            })),
                        },
                    })),
                },
            },
            include: {
                workouts: {
                    include: {
                        exercises: {
                            include: {
                                exercise: true,
                            },
                            orderBy: { order: 'asc' },
                        },
                    },
                },
                student: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        return trainingPlan;
    }
    async findAllForPersonal(personalId, studentId) {
        const where = { personalId };
        if (studentId) {
            where.studentId = studentId;
        }
        return this.prisma.trainingPlan.findMany({
            where,
            include: {
                student: {
                    select: { id: true, name: true, avatar: true },
                },
                workouts: {
                    select: {
                        id: true,
                        name: true,
                        _count: {
                            select: { exercises: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAllForStudent(studentId) {
        const now = new Date();
        return this.prisma.trainingPlan.findMany({
            where: {
                studentId,
                endDate: { gte: now },
            },
            include: {
                personal: {
                    select: { id: true, name: true },
                },
                workouts: {
                    include: {
                        exercises: {
                            include: {
                                exercise: true,
                            },
                            orderBy: { order: 'asc' },
                        },
                    },
                },
            },
            orderBy: { startDate: 'desc' },
        });
    }
    async findOne(id, userId, userRole) {
        const trainingPlan = await this.prisma.trainingPlan.findUnique({
            where: { id },
            include: {
                student: {
                    select: { id: true, name: true, email: true },
                },
                personal: {
                    select: { id: true, name: true },
                },
                workouts: {
                    include: {
                        exercises: {
                            include: {
                                exercise: true,
                            },
                            orderBy: { order: 'asc' },
                        },
                    },
                },
            },
        });
        if (!trainingPlan) {
            throw new common_1.NotFoundException('Training plan not found');
        }
        if (userRole === client_1.UserRole.PERSONAL && trainingPlan.personalId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (userRole === client_1.UserRole.STUDENT && trainingPlan.studentId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return trainingPlan;
    }
    async remove(personalId, id) {
        const trainingPlan = await this.prisma.trainingPlan.findUnique({
            where: { id },
        });
        if (!trainingPlan) {
            throw new common_1.NotFoundException('Training plan not found');
        }
        if (trainingPlan.personalId !== personalId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        await this.prisma.trainingPlan.delete({
            where: { id },
        });
        return { message: 'Training plan deleted successfully' };
    }
    async getExpiring(personalId, daysAhead = 7) {
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);
        return this.prisma.trainingPlan.findMany({
            where: {
                personalId,
                endDate: {
                    gte: now,
                    lte: futureDate,
                },
            },
            include: {
                student: {
                    select: { id: true, name: true, email: true, avatar: true },
                },
                workouts: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: { endDate: 'asc' },
        });
    }
    async toggleActive(personalId, id) {
        const trainingPlan = await this.prisma.trainingPlan.findUnique({
            where: { id },
        });
        if (!trainingPlan) {
            throw new common_1.NotFoundException('Training plan not found');
        }
        if (trainingPlan.personalId !== personalId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const updated = await this.prisma.trainingPlan.update({
            where: { id },
            data: { isActive: !trainingPlan.isActive },
        });
        return {
            message: updated.isActive
                ? 'Training plan activated'
                : 'Training plan deactivated',
            isActive: updated.isActive,
        };
    }
};
exports.TrainingPlansService = TrainingPlansService;
exports.TrainingPlansService = TrainingPlansService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService,
        students_service_1.StudentsService])
], TrainingPlansService);
//# sourceMappingURL=training-plans.service.js.map