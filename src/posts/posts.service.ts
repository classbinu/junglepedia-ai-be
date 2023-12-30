import * as crypto from 'crypto';

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { CreatePostDto } from './dto/create-post.dto';
import { PostsMongoRepository } from './posts.repository';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsMongoRepository) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    createPostDto.author = userId;

    const hash = crypto.createHash('sha256');
    hash.update(createPostDto.content);
    createPostDto.hash = hash.digest('hex');
    return await this.postsRepository.create(createPostDto);
  }

  async findAll() {
    return await this.postsRepository.findAll();
  }

  async findOne(id: string) {
    return await this.postsRepository.findOne(id);
  }

  async findOneByField(field: string, value: string) {
    return await this.postsRepository.findOneByField(field, value);
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string) {
    const post = await this.findOne(id);
    const author = post.author.toString();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (userId !== author) {
      throw new UnauthorizedException(
        'You are not allowed to update this post',
      );
    }
    return await this.postsRepository.update(id, updatePostDto);
  }

  async remove(id: string, userId: string) {
    const post = await this.findOne(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (userId !== post.author.toString()) {
      throw new UnauthorizedException(
        'You are not allowed to delete this post',
      );
    }
    return await this.postsRepository.remove(id);
  }

  async toggleLike(id: string, userId: string) {
    const post = await this.findOne(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return await this.postsRepository.toggleLike(id, userId);
  }

  async toggleDislike(id: string, userId: string) {
    const post = await this.findOne(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return await this.postsRepository.toggleDislike(id, userId);
  }
}
