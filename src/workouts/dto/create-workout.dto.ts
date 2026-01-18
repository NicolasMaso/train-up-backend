import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class WorkoutExerciseDto {
  @IsString()
  @IsNotEmpty()
  exerciseId: string;

  @IsNumber()
  order: number;

  @IsNumber()
  sets: number;

  @IsString()
  @IsNotEmpty()
  reps: string;

  @IsNumber()
  @IsOptional()
  restSeconds?: number;

  @IsString()
  @IsOptional()
  weight?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateWorkoutDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  exercises: WorkoutExerciseDto[];
}
