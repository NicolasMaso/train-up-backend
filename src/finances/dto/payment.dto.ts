import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class CreatePaymentDto {
  @IsString()
  studentId: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  dueDate: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdatePaymentDto {
  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @IsDateString()
  @IsOptional()
  paidDate?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
