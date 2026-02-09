import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateUserRequestDto {
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;
}
