import { Post, PostSchema } from './schema/post.schema';

import { AuthModule } from 'src/auth/auth.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsMongoRepository } from './posts.repository';
import { PostsService } from './posts.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    AuthModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsMongoRepository],
})
export class PostsModule {}
