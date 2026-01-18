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
import { AnamnesisService } from './anamnesis.service';
import { CreateAnamnesisDto, UpdateAnamnesisDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('anamnesis')
@UseGuards(JwtAuthGuard)
export class AnamnesisController {
  constructor(private readonly anamnesisService: AnamnesisService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.PERSONAL)
  async create(
    @CurrentUser() user: { id: string },
    @Body() createAnamnesisDto: CreateAnamnesisDto,
  ) {
    return this.anamnesisService.create(user.id, createAnamnesisDto);
  }

  @Get()
  async findAllByStudent(
    @CurrentUser() user: { id: string; role: UserRole },
    @Query('studentId') studentId: string,
  ) {
    const targetStudentId = user.role === UserRole.STUDENT ? user.id : studentId;
    return this.anamnesisService.findAllByStudent(targetStudentId, user.id, user.role);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: { id: string; role: UserRole },
    @Param('id') id: string,
  ) {
    return this.anamnesisService.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PERSONAL)
  async update(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() updateAnamnesisDto: UpdateAnamnesisDto,
  ) {
    return this.anamnesisService.update(user.id, id, updateAnamnesisDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PERSONAL)
  async remove(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ) {
    return this.anamnesisService.remove(user.id, id);
  }
}
