import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  type?: number;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string | null;
}
