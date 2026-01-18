import { IsString, IsOptional, IsDateString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class WorkoutExerciseDto {
  @IsString()
  exerciseId: string;

  @IsNumber()
  order: number;

  @IsNumber()
  sets: number;

  @IsString()
  reps: string;

  @IsOptional()
  @IsNumber()
  restSeconds?: number;

  @IsOptional()
  @IsString()
  weight?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

class WorkoutDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  exercises: WorkoutExerciseDto[];
}

export class CreateTrainingPlanDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  studentId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutDto)
  workouts: WorkoutDto[];
}
