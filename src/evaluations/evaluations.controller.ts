import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto, UpdateEvaluationDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('evaluations')
@UseGuards(JwtAuthGuard)
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.PERSONAL)
  async create(
    @CurrentUser() user: { id: string },
    @Body() createEvaluationDto: CreateEvaluationDto,
  ) {
    return this.evaluationsService.create(user.id, createEvaluationDto);
  }

  @Get()
  async findAllByStudent(
    @CurrentUser() user: { id: string; role: UserRole },
    @Query('studentId') studentId: string,
  ) {
    const targetStudentId = user.role === UserRole.STUDENT ? user.id : studentId;
    return this.evaluationsService.findAllByStudent(targetStudentId, user.id, user.role);
  }

  @Get('progress')
  async getProgress(
    @CurrentUser() user: { id: string; role: UserRole },
    @Query('studentId') studentId: string,
  ) {
    const targetStudentId = user.role === UserRole.STUDENT ? user.id : studentId;
    return this.evaluationsService.getProgress(targetStudentId, user.id, user.role);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: { id: string; role: UserRole },
    @Param('id') id: string,
  ) {
    return this.evaluationsService.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PERSONAL)
  async update(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() updateEvaluationDto: UpdateEvaluationDto,
  ) {
    return this.evaluationsService.update(user.id, id, updateEvaluationDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PERSONAL)
  async remove(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ) {
    return this.evaluationsService.remove(user.id, id);
  }
}
