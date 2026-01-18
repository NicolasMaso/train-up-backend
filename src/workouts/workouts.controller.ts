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
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto, UpdateWorkoutDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('workouts')
@UseGuards(JwtAuthGuard)
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.PERSONAL)
  async create(
    @CurrentUser() user: { id: string },
    @Body() createWorkoutDto: CreateWorkoutDto,
  ) {
    return this.workoutsService.create(user.id, createWorkoutDto);
  }

  @Get('expiring')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PERSONAL)
  async getExpiring(
    @CurrentUser() user: { id: string },
    @Query('days') days?: string,
  ) {
    const daysAhead = days ? parseInt(days, 10) : 7;
    return this.workoutsService.getExpiring(user.id, daysAhead);
  }

  @Get()
  async findAll(
    @CurrentUser() user: { id: string; role: UserRole },
    @Query('studentId') studentId?: string,
  ) {
    if (user.role === UserRole.STUDENT) {
      return this.workoutsService.findAllForStudent(user.id);
    }
    return this.workoutsService.findAllForPersonal(user.id, studentId);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: { id: string; role: UserRole },
    @Param('id') id: string,
  ) {
    return this.workoutsService.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PERSONAL)
  async update(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() updateWorkoutDto: UpdateWorkoutDto,
  ) {
    return this.workoutsService.update(user.id, id, updateWorkoutDto);
  }

  @Patch(':id/complete')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  async markAsCompleted(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ) {
    return this.workoutsService.markAsCompleted(id, user.id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PERSONAL)
  async remove(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ) {
    return this.workoutsService.remove(user.id, id);
  }
}
