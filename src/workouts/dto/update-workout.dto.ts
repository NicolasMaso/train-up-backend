import { IsArray, IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WorkoutExerciseDto } from './create-workout.dto';

export class UpdateWorkoutDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  @IsOptional()
  exercises?: WorkoutExerciseDto[];
}
