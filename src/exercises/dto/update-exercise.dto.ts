import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateExerciseDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsString()
  @IsOptional()
  muscleGroup?: string;

  @IsString()
  @IsOptional()
  equipment?: string;
}
