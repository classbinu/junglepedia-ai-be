import { AuthModule } from 'src/auth/auth.module';
import { Comment } from 'src/comments/entities/Comment.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Module } from '@nestjs/common';
import { Post } from 'src/posts/entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    TypeOrmModule.forFeature([Comment]),
    TypeOrmModule.forFeature([User]),
    AuthModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [TypeOrmModule],
})
export class CommentsModule {}
