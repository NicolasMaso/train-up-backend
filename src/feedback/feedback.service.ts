import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateFeedbackDto, CreateResponseDto } from './dto';
import { FeedbackStatus, UserRole } from '@prisma/client';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  // Aluno cria feedback sobre um treino
  async create(studentId: string, createFeedbackDto: CreateFeedbackDto) {
    const { workoutId, message } = createFeedbackDto;

    // Verificar se o treino existe e pertence ao aluno
    const workout = await this.prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout) {
      throw new NotFoundException('Treino não encontrado');
    }

    if (workout.studentId !== studentId) {
      throw new ForbiddenException('Você não pode dar feedback para este treino');
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

  // Listar feedbacks para um Personal (de todos os seus alunos)
  async findAllByPersonal(personalId: string, status?: FeedbackStatus) {
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

  // Listar feedbacks de um aluno
  async findAllByStudent(studentId: string) {
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

  // Obter detalhes de um feedback
  async findOne(id: string, userId: string, userRole: UserRole) {
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
      throw new NotFoundException('Feedback não encontrado');
    }

    // Verificar permissão
    if (userRole === UserRole.STUDENT && feedback.studentId !== userId) {
      throw new ForbiddenException('Você não tem acesso a este feedback');
    }

    if (userRole === UserRole.PERSONAL && feedback.workout.personalId !== userId) {
      throw new ForbiddenException('Você não tem acesso a este feedback');
    }

    return feedback;
  }

  // Personal adiciona resposta a um feedback
  async addResponse(feedbackId: string, personalId: string, createResponseDto: CreateResponseDto) {
    const feedback = await this.prisma.workoutFeedback.findUnique({
      where: { id: feedbackId },
      include: {
        workout: true,
      },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback não encontrado');
    }

    if (feedback.workout.personalId !== personalId) {
      throw new ForbiddenException('Você não pode responder este feedback');
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

  // Personal marca feedback como resolvido
  async resolve(feedbackId: string, personalId: string) {
    const feedback = await this.prisma.workoutFeedback.findUnique({
      where: { id: feedbackId },
      include: {
        workout: true,
      },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback não encontrado');
    }

    if (feedback.workout.personalId !== personalId) {
      throw new ForbiddenException('Você não pode resolver este feedback');
    }

    return this.prisma.workoutFeedback.update({
      where: { id: feedbackId },
      data: {
        status: FeedbackStatus.RESOLVED,
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

  // Reabrir feedback (se necessário)
  async reopen(feedbackId: string, personalId: string) {
    const feedback = await this.prisma.workoutFeedback.findUnique({
      where: { id: feedbackId },
      include: {
        workout: true,
      },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback não encontrado');
    }

    if (feedback.workout.personalId !== personalId) {
      throw new ForbiddenException('Você não pode reabrir este feedback');
    }

    return this.prisma.workoutFeedback.update({
      where: { id: feedbackId },
      data: {
        status: FeedbackStatus.OPEN,
        resolvedAt: null,
      },
    });
  }

  // Contar feedbacks abertos para um Personal (para dashboard)
  async countOpenByPersonal(personalId: string) {
    return this.prisma.workoutFeedback.count({
      where: {
        status: FeedbackStatus.OPEN,
        workout: {
          personalId,
        },
      },
    });
  }
}
