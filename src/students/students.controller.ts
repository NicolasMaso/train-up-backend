import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PERSONAL)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  async create(
    @CurrentUser() user: { id: string },
    @Body() createStudentDto: CreateStudentDto,
  ) {
    return this.studentsService.create(user.id, createStudentDto);
  }

  @Get()
  async findAll(@CurrentUser() user: { id: string }) {
    return this.studentsService.findAll(user.id);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: { id: string },
    @Param('id') studentId: string,
  ) {
    return this.studentsService.findOne(user.id, studentId);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: { id: string },
    @Param('id') studentId: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.update(user.id, studentId, updateStudentDto);
  }

  @Delete(':id')
  async remove(
    @CurrentUser() user: { id: string },
    @Param('id') studentId: string,
  ) {
    return this.studentsService.remove(user.id, studentId);
  }
}
