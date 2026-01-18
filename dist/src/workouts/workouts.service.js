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
exports.WorkoutsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_1 = require("../prisma");
const students_service_1 = require("../students/students.service");
let WorkoutsService = class WorkoutsService {
    prisma;
    studentsService;
    constructor(prisma, studentsService) {
        this.prisma = prisma;
        this.studentsService = studentsService;
    }
    async create(personalId, createWorkoutDto) {
        const { name, description, studentId, trainingPlanId, exercises } = createWorkoutDto;
        await this.studentsService.verifyStudentOwnership(personalId, studentId);
        const workout = await this.prisma.workout.create({
            data: {
                name,
                description,
                studentId,
                personalId,
                trainingPlanId,
                exercises: {
                    create: exercises.map((ex) => ({
                        exerciseId: ex.exerciseId,
                        order: ex.order,
                        sets: ex.sets,
                        reps: ex.reps,
                        restSeconds: ex.restSeconds,
                        weight: ex.weight,
                        notes: ex.notes,
                    })),
                },
            },
            include: {
                exercises: {
                    include: {
                        exercise: true,
                    },
                    orderBy: { order: 'asc' },
                },
                student: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        return workout;
    }
    async findAllForPersonal(personalId, studentId) {
        const where = { personalId };
        if (studentId) {
            where.studentId = studentId;
        }
        return this.prisma.workout.findMany({
            where,
            include: {
                student: {
                    select: { id: true, name: true },
                },
                exercises: {
                    include: {
                        exercise: true,
                    },
                    orderBy: { order: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAllForStudent(studentId) {
        return this.prisma.workout.findMany({
            where: { studentId },
            include: {
                personal: {
                    select: { id: true, name: true },
                },
                exercises: {
                    include: {
                        exercise: true,
                    },
                    orderBy: { order: 'asc' },
                },
                trainingPlan: {
                    select: { id: true, name: true, startDate: true, endDate: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId, userRole) {
        const workout = await this.prisma.workout.findUnique({
            where: { id },
            include: {
                student: {
                    select: { id: true, name: true, email: true },
                },
                personal: {
                    select: { id: true, name: true },
                },
                exercises: {
                    include: {
                        exercise: true,
                    },
                    orderBy: { order: 'asc' },
                },
            },
        });
        if (!workout) {
            throw new common_1.NotFoundException('Workout not found');
        }
        if (userRole === client_1.UserRole.PERSONAL && workout.personalId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (userRole === client_1.UserRole.STUDENT && workout.studentId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return workout;
    }
    async update(personalId, id, updateWorkoutDto) {
        const workout = await this.prisma.workout.findUnique({
            where: { id },
        });
        if (!workout) {
            throw new common_1.NotFoundException('Workout not found');
        }
        if (workout.personalId !== personalId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const { name, description, exercises } = updateWorkoutDto;
        if (exercises) {
            await this.prisma.workoutExercise.deleteMany({
                where: { workoutId: id },
            });
            return this.prisma.workout.update({
                where: { id },
                data: {
                    name,
                    description,
                    exercises: {
                        create: exercises.map((ex) => ({
                            exerciseId: ex.exerciseId,
                            order: ex.order,
                            sets: ex.sets,
                            reps: ex.reps,
                            restSeconds: ex.restSeconds,
                            weight: ex.weight,
                            notes: ex.notes,
                        })),
                    },
                },
                include: {
                    exercises: {
                        include: {
                            exercise: true,
                        },
                        orderBy: { order: 'asc' },
                    },
                },
            });
        }
        return this.prisma.workout.update({
            where: { id },
            data: {
                name,
                description,
            },
            include: {
                exercises: {
                    include: {
                        exercise: true,
                    },
                    orderBy: { order: 'asc' },
                },
            },
        });
    }
    async markAsCompleted(id, studentId) {
        const workout = await this.prisma.workout.findUnique({
            where: { id },
        });
        if (!workout) {
            throw new common_1.NotFoundException('Workout not found');
        }
        if (workout.studentId !== studentId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.workout.update({
            where: { id },
            data: {
                completedAt: new Date(),
            },
        });
    }
    async remove(personalId, id) {
        const workout = await this.prisma.workout.findUnique({
            where: { id },
        });
        if (!workout) {
            throw new common_1.NotFoundException('Workout not found');
        }
        if (workout.personalId !== personalId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        await this.prisma.workout.delete({
            where: { id },
        });
        return { message: 'Workout deleted successfully' };
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
};
exports.WorkoutsService = WorkoutsService;
exports.WorkoutsService = WorkoutsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService,
        students_service_1.StudentsService])
], WorkoutsService);
//# sourceMappingURL=workouts.service.js.map