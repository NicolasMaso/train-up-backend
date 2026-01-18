import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma';
import { CreateStudentDto, UpdateStudentDto } from './dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(personalId: string, createStudentDto: CreateStudentDto) {
    const { email, password, name, phone } = createStudentDto;

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student linked to personal
    const student = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: UserRole.STUDENT,
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

  async findAll(personalId: string) {
    const students = await this.prisma.user.findMany({
      where: {
        personalId,
        role: UserRole.STUDENT,
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

  async findOne(personalId: string, studentId: string) {
    const student = await this.prisma.user.findFirst({
      where: {
        id: studentId,
        personalId,
        role: UserRole.STUDENT,
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
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async update(personalId: string, studentId: string, updateStudentDto: UpdateStudentDto) {
    // Verify student belongs to personal
    const student = await this.prisma.user.findFirst({
      where: {
        id: studentId,
        personalId,
        role: UserRole.STUDENT,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
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

  async remove(personalId: string, studentId: string) {
    // Verify student belongs to personal
    const student = await this.prisma.user.findFirst({
      where: {
        id: studentId,
        personalId,
        role: UserRole.STUDENT,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    await this.prisma.user.delete({
      where: { id: studentId },
    });

    return { message: 'Student removed successfully' };
  }

  // Helper to verify student belongs to personal
  async verifyStudentOwnership(personalId: string, studentId: string) {
    const student = await this.prisma.user.findFirst({
      where: {
        id: studentId,
        personalId,
        role: UserRole.STUDENT,
      },
    });

    if (!student) {
      throw new ForbiddenException('Student does not belong to this personal trainer');
    }

    return student;
  }
}
