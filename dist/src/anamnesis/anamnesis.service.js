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
exports.AnamnesisService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_1 = require("../prisma");
const students_service_1 = require("../students/students.service");
let AnamnesisService = class AnamnesisService {
    prisma;
    studentsService;
    constructor(prisma, studentsService) {
        this.prisma = prisma;
        this.studentsService = studentsService;
    }
    async create(personalId, createAnamnesisDto) {
        const { studentId, ...data } = createAnamnesisDto;
        await this.studentsService.verifyStudentOwnership(personalId, studentId);
        return this.prisma.anamnesis.create({
            data: {
                studentId,
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
        return this.prisma.anamnesis.findMany({
            where: { studentId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId, userRole) {
        const anamnesis = await this.prisma.anamnesis.findUnique({
            where: { id },
            include: {
                student: {
                    select: { id: true, name: true, email: true, personalId: true },
                },
            },
        });
        if (!anamnesis) {
            throw new common_1.NotFoundException('Anamnesis not found');
        }
        if (userRole === client_1.UserRole.STUDENT && anamnesis.studentId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (userRole === client_1.UserRole.PERSONAL && anamnesis.student.personalId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return anamnesis;
    }
    async update(personalId, id, updateAnamnesisDto) {
        const anamnesis = await this.prisma.anamnesis.findUnique({
            where: { id },
            include: {
                student: {
                    select: { personalId: true },
                },
            },
        });
        if (!anamnesis) {
            throw new common_1.NotFoundException('Anamnesis not found');
        }
        if (anamnesis.student.personalId !== personalId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.anamnesis.update({
            where: { id },
            data: updateAnamnesisDto,
        });
    }
    async remove(personalId, id) {
        const anamnesis = await this.prisma.anamnesis.findUnique({
            where: { id },
            include: {
                student: {
                    select: { personalId: true },
                },
            },
        });
        if (!anamnesis) {
            throw new common_1.NotFoundException('Anamnesis not found');
        }
        if (anamnesis.student.personalId !== personalId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        await this.prisma.anamnesis.delete({
            where: { id },
        });
        return { message: 'Anamnesis deleted successfully' };
    }
};
exports.AnamnesisService = AnamnesisService;
exports.AnamnesisService = AnamnesisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService,
        students_service_1.StudentsService])
], AnamnesisService);
//# sourceMappingURL=anamnesis.service.js.map