"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma_1 = require("../prisma");
let StudentsService = class StudentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(personalId, createStudentDto) {
        const { email, password, name, phone } = createStudentDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const student = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                role: client_1.UserRole.STUDENT,
                personalId,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                createdAt: true,
            },
        });
        return student;
    }
    async findAll(personalId) {
        const students = await this.prisma.user.findMany({
            where: {
                personalId,
                role: client_1.UserRole.STUDENT,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                avatar: true,
                createdAt: true,
                _count: {
                    select: {
                        studentWorkouts: true,
                        evaluations: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
        return students;
    }
    async findOne(personalId, studentId) {
        const student = await this.prisma.user.findFirst({
            where: {
                id: studentId,
                personalId,
                role: client_1.UserRole.STUDENT,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                avatar: true,
                createdAt: true,
                anamnesis: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                evaluations: {
                    orderBy: { evaluationDate: 'desc' },
                    take: 3,
                },
                studentWorkouts: {
                    orderBy: { scheduledDate: 'desc' },
                    take: 5,
                },
            },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        return student;
    }
    async update(personalId, studentId, updateStudentDto) {
        const student = await this.prisma.user.findFirst({
            where: {
                id: studentId,
                personalId,
                role: client_1.UserRole.STUDENT,
            },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        return this.prisma.user.update({
            where: { id: studentId },
            data: updateStudentDto,
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                avatar: true,
                updatedAt: true,
            },
        });
    }
    async remove(personalId, studentId) {
        const student = await this.prisma.user.findFirst({
            where: {
                id: studentId,
                personalId,
                role: client_1.UserRole.STUDENT,
            },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        await this.prisma.user.delete({
            where: { id: studentId },
        });
        return { message: 'Student removed successfully' };
    }
    async verifyStudentOwnership(personalId, studentId) {
        const student = await this.prisma.user.findFirst({
            where: {
                id: studentId,
                personalId,
                role: client_1.UserRole.STUDENT,
            },
        });
        if (!student) {
            throw new common_1.ForbiddenException('Student does not belong to this personal trainer');
        }
        return student;
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], StudentsService);
//# sourceMappingURL=students.service.js.map