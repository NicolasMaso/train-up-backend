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
import { UserRole, PaymentStatus } from '@prisma/client';
import { FinancesService } from './finances.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('finances')
@UseGuards(JwtAuthGuard)
export class FinancesController {
  constructor(private readonly financesService: FinancesService) {}

  @Post('payments')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PERSONAL)
  async createPayment(
    @CurrentUser() user: { id: string },
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.financesService.createPayment(user.id, createPaymentDto);
  }

  @Get('payments')
  async findAllPayments(
    @CurrentUser() user: { id: string; role: UserRole },
    @Query('studentId') studentId?: string,
    @Query('status') status?: PaymentStatus,
  ) {
    if (user.role === UserRole.STUDENT) {
      return this.financesService.findAllForStudent(user.id);
    }
    return this.financesService.findAllForPersonal(user.id, studentId, status);
  }

  @Get('summary')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PERSONAL)
  async getFinancialSummary(@CurrentUser() user: { id: string }) {
    return this.financesService.getFinancialSummary(user.id);
  }

  @Get('payments/:id')
  async findOne(
    @CurrentUser() user: { id: string; role: UserRole },
    @Param('id') id: string,
  ) {
    return this.financesService.findOne(id, user.id, user.role);
  }

  @Patch('payments/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PERSONAL)
  async updatePayment(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.financesService.update(user.id, id, updatePaymentDto);
  }

  @Patch('payments/:id/pay')
  async markAsPaid(
    @CurrentUser() user: { id: string; role: UserRole },
    @Param('id') id: string,
  ) {
    return this.financesService.markAsPaid(id, user.id, user.role);
  }

  @Delete('payments/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PERSONAL)
  async removePayment(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ) {
    return this.financesService.remove(user.id, id);
  }
}
