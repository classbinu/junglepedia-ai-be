import { AuthModule } from 'src/auth/auth.module';
import { Comment } from 'src/comments/entities/Comment.entity';
import { CommentsModule } from 'src/comments/comments.module';
import { CommentsService } from 'src/comments/comments.service';
import { LangchainModule } from 'src/langchain/langchain.module';
import { LangchainService } from 'src/langchain/langchain.service';
import { Module } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/postLike.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Comment, PostLike]),
    AuthModule,
    CommentsModule,
    LangchainModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, CommentsService, LangchainService],
  exports: [TypeOrmModule],
})
export class PostsModule {}
