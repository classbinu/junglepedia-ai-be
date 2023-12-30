import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsMongoId()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  hash?: string;
}
