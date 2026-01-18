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
exports.EvaluationsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_1 = require("../prisma");
const students_service_1 = require("../students/students.service");
let EvaluationsService = class EvaluationsService {
    prisma;
    studentsService;
    constructor(prisma, studentsService) {
        this.prisma = prisma;
        this.studentsService = studentsService;
    }
    async create(personalId, createEvaluationDto) {
        const { studentId, weight, height, evaluationDate, ...data } = createEvaluationDto;
        await this.studentsService.verifyStudentOwnership(personalId, studentId);
        const heightInMeters = height / 100;
        const bmi = Number((weight / (heightInMeters * heightInMeters)).toFixed(2));
        return this.prisma.evaluation.create({
            data: {
                studentId,
                weight,
                height,
                bmi,
                evaluationDate: evaluationDate ? new Date(evaluationDate) : new Date(),
                ...data,
            },
            include: {
                student: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    }
    async findAllByStudent(studentId, userId, userRole) {
        if (userRole === client_1.UserRole.STUDENT && studentId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (userRole === client_1.UserRole.PERSONAL) {
            await this.studentsService.verifyStudentOwnership(userId, studentId);
        }
        return this.prisma.evaluation.findMany({
            where: { studentId },
            orderBy: { evaluationDate: 'desc' },
        });
    }
    async findOne(id, userId, userRole) {
        const evaluation = await this.prisma.evaluation.findUnique({
            where: { id },
            include: {
                student: {
                    select: { id: true, name: true, email: true, personalId: true },
                },
            },
        });
        if (!evaluation) {
            throw new common_1.NotFoundException('Evaluation not found');
        }
        if (userRole === client_1.UserRole.STUDENT && evaluation.studentId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (userRole === client_1.UserRole.PERSONAL && evaluation.student.personalId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return evaluation;
    }
    async getProgress(studentId, userId, userRole) {
        if (userRole === client_1.UserRole.STUDENT && studentId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (userRole === client_1.UserRole.PERSONAL) {
            await this.studentsService.verifyStudentOwnership(userId, studentId);
        }
        const evaluations = await this.prisma.evaluation.findMany({
            where: { studentId },
            orderBy: { evaluationDate: 'asc' },
            select: {
                id: true,
                weight: true,
                bodyFat: true,
                bmi: true,
                evaluationDate: true,
            },
        });
        if (evaluations.length < 2) {
            return {
                evaluations,
                progress: null,
                message: 'Not enough evaluations to calculate progress',
            };
        }
        const first = evaluations[0];
        const last = evaluations[evaluations.length - 1];
        return {
            evaluations,
            progress: {
                weightChange: Number((last.weight - first.weight).toFixed(2)),
                bodyFatChange: first.bodyFat && last.bodyFat
                    ? Number((last.bodyFat - first.bodyFat).toFixed(2))
                    : null,
                bmiChange: first.bmi && last.bmi
                    ? Number((last.bmi - first.bmi).toFixed(2))
                    : null,
                periodDays: Math.floor((last.evaluationDate.getTime() - first.evaluationDate.getTime()) / (1000 * 60 * 60 * 24)),
            },
        };
    }
    async update(personalId, id, updateEvaluationDto) {
        const evaluation = await this.prisma.evaluation.findUnique({
            where: { id },
            include: {
                student: {
                    select: { personalId: true },
                },
            },
        });
        if (!evaluation) {
            throw new common_1.NotFoundException('Evaluation not found');
        }
        if (evaluation.student.personalId !== personalId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const { weight, height, ...data } = updateEvaluationDto;
        let bmi = evaluation.bmi;
        const newWeight = weight ?? evaluation.weight;
        const newHeight = height ?? evaluation.height;
        if (weight || height) {
            const heightInMeters = newHeight / 100;
            bmi = Number((newWeight / (heightInMeters * heightInMeters)).toFixed(2));
        }
        return this.prisma.evaluation.update({
            where: { id },
            data: {
                weight: newWeight,
                height: newHeight,
                bmi,
                ...data,
            },
        });
    }
    async remove(personalId, id) {
        const evaluation = await this.prisma.evaluation.findUnique({
            where: { id },
            include: {
                student: {
                    select: { personalId: true },
                },
            },
        });
        if (!evaluation) {
            throw new common_1.NotFoundException('Evaluation not found');
        }
        if (evaluation.student.personalId !== personalId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        await this.prisma.evaluation.delete({
            where: { id },
        });
        return { message: 'Evaluation deleted successfully' };
    }
};
exports.EvaluationsService = EvaluationsService;
exports.EvaluationsService = EvaluationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService,
        students_service_1.StudentsService])
], EvaluationsService);
//# sourceMappingURL=evaluations.service.js.map