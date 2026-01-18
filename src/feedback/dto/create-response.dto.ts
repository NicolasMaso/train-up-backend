import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResponseDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
