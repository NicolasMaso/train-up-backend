import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole, FeedbackStatus } from '@prisma/client';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto, CreateResponseDto } from './dto';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    sub: string;
    email: string;
    role: UserRole;
  };
}

@Controller('feedback')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // Aluno cria feedback
  @Post()
  @Roles(UserRole.STUDENT)
  create(@Request() req: AuthenticatedRequest, @Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(req.user.sub, createFeedbackDto);
  }

  // Listar feedbacks (Personal vê dos alunos, Student vê os seus)
  @Get()
  findAll(@Request() req: AuthenticatedRequest, @Query('status') status?: string) {
    const feedbackStatus = status === 'RESOLVED' 
      ? FeedbackStatus.RESOLVED 
      : status === 'OPEN' 
        ? FeedbackStatus.OPEN 
        : undefined;

    if (req.user.role === UserRole.PERSONAL) {
      return this.feedbackService.findAllByPersonal(req.user.sub, feedbackStatus);
    }
    return this.feedbackService.findAllByStudent(req.user.sub);
  }

  // Detalhes de um feedback
  @Get(':id')
  findOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.feedbackService.findOne(id, req.user.sub, req.user.role);
  }

  // Personal adiciona resposta
  @Post(':id/response')
  @Roles(UserRole.PERSONAL)
  addResponse(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() createResponseDto: CreateResponseDto,
  ) {
    return this.feedbackService.addResponse(id, req.user.sub, createResponseDto);
  }

  // Personal marca como resolvido
  @Patch(':id/resolve')
  @Roles(UserRole.PERSONAL)
  resolve(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.feedbackService.resolve(id, req.user.sub);
  }

  // Personal reabre feedback
  @Patch(':id/reopen')
  @Roles(UserRole.PERSONAL)
  reopen(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.feedbackService.reopen(id, req.user.sub);
  }
}
