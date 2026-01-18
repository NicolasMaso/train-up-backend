import { IsDateString, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEvaluationDto {
  @IsString()
  studentId: string;

  // Basic measurements
  @IsNumber()
  weight: number; // kg

  @IsNumber()
  height: number; // cm

  @IsNumber()
  @IsOptional()
  bodyFat?: number; // percentage

  // Body measurements (cm)
  @IsNumber()
  @IsOptional()
  chest?: number;

  @IsNumber()
  @IsOptional()
  waist?: number;

  @IsNumber()
  @IsOptional()
  hip?: number;

  @IsNumber()
  @IsOptional()
  leftArm?: number;

  @IsNumber()
  @IsOptional()
  rightArm?: number;

  @IsNumber()
  @IsOptional()
  leftThigh?: number;

  @IsNumber()
  @IsOptional()
  rightThigh?: number;

  @IsNumber()
  @IsOptional()
  leftCalf?: number;

  @IsNumber()
  @IsOptional()
  rightCalf?: number;

  // Additional
  @IsInt()
  @IsOptional()
  restingHeartRate?: number;

  @IsString()
  @IsOptional()
  bloodPressure?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  evaluationDate?: string;
}
