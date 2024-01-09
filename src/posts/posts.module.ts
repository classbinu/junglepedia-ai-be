import { AuthModule } from '../auth/auth.module';
import { Comment } from '../comments/entities/comment.entity';
import { CommentsModule } from '../comments/comments.module';
import { CommentsService } from '../comments/comments.service';
import { LangchainModule } from '../langchain/langchain.module';
import { LangchainService } from '../langchain/langchain.service';
import { Module } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { PostDislike } from './entities/postDislike.entity';
import { PostLike } from './entities/postLike.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Comment, PostLike, PostDislike]),
    AuthModule,
    CommentsModule,
    LangchainModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, CommentsService, LangchainService],
  exports: [TypeOrmModule],
})
export class PostsModule {}
