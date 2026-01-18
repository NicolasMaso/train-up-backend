import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { TrainingPlansService } from './training-plans.service';
import { CreateTrainingPlanDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('training-plans')
@UseGuards(JwtAuthGuard)
export class TrainingPlansController {
  constructor(private readonly trainingPlansService: TrainingPlansService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.PERSONAL)
  async create(
    @CurrentUser() user: { id: string },
    @Body() createDto: CreateTrainingPlanDto,
  ) {
    return this.trainingPlansService.create(user.id, createDto);
  }

  @Get('expiring')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PERSONAL)
  async getExpiring(
    @CurrentUser() user: { id: string },
    @Query('days') days?: string,
  ) {
    const daysAhead = days ? parseInt(days, 10) : 7;
    return this.trainingPlansService.getExpiring(user.id, daysAhead);
  }

  @Get()
  async findAll(
    @CurrentUser() user: { id: string; role: UserRole },
    @Query('studentId') studentId?: string,
  ) {
    if (user.role === UserRole.STUDENT) {
      return this.trainingPlansService.findAllForStudent(user.id);
    }
    return this.trainingPlansService.findAllForPersonal(user.id, studentId);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: { id: string; role: UserRole },
    @Param('id') id: string,
  ) {
    return this.trainingPlansService.findOne(id, user.id, user.role);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PERSONAL)
  async remove(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.trainingPlansService.remove(user.id, id);
  }

  @Patch(':id/toggle-active')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PERSONAL)
  async toggleActive(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ) {
    return this.trainingPlansService.toggleActive(user.id, id);
  }
}
