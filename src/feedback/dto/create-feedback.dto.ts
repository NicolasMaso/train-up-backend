import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateFeedbackDto {
  @IsUUID()
  @IsNotEmpty()
  workoutId: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
