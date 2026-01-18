import { IsInt, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateEvaluationDto {
  // Basic measurements
  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  bodyFat?: number;

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
