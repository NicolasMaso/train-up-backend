import { IsBoolean, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAnamnesisDto {
  // Medical History
  @IsString()
  @IsOptional()
  medicalConditions?: string;

  @IsString()
  @IsOptional()
  medications?: string;

  @IsString()
  @IsOptional()
  allergies?: string;

  @IsString()
  @IsOptional()
  previousInjuries?: string;

  @IsString()
  @IsOptional()
  surgeries?: string;

  // Lifestyle
  @IsString()
  @IsOptional()
  occupation?: string;

  @IsInt()
  @IsOptional()
  sleepHours?: number;

  @IsInt()
  @IsOptional()
  stressLevel?: number;

  @IsBoolean()
  @IsOptional()
  smokingHabit?: boolean;

  @IsString()
  @IsOptional()
  alcoholConsumption?: string;

  // Fitness Goals
  @IsString()
  @IsOptional()
  mainGoal?: string;

  @IsString()
  @IsOptional()
  secondaryGoals?: string;

  @IsString()
  @IsOptional()
  exerciseExperience?: string;

  @IsString()
  @IsOptional()
  currentActivityLevel?: string;

  // Diet
  @IsString()
  @IsOptional()
  dietaryRestrictions?: string;

  @IsInt()
  @IsOptional()
  mealsPerDay?: number;

  @IsNumber()
  @IsOptional()
  waterIntakeLiters?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
