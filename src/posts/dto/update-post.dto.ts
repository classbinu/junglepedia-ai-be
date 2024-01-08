import { CreatePostDto } from './create-post.dto';
import { IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsNumber()
  likesCount?: number;

  @IsNumber()
  dislikesCount?: number;
}
