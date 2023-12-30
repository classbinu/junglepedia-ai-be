import { CreatePostDto } from './dto/create-post.dto';
import { Injectable } from '@nestjs/common';
import { PostsMongoRepository } from './posts.repository';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsMongoRepository) {}

  async create(createPostDto: CreatePostDto) {
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

  async update(id: string, updatePostDto: UpdatePostDto) {
    return await this.postsRepository.update(id, updatePostDto);
  }

  async remove(id: string) {
    return await this.postsRepository.remove(id);
  }

  // async addLike(id: string, userId: string) {
  //   return await this.postsRepository.addLike(id, userId);
  // }

  // async removeLike(id: string, userId: string) {
  //   return await this.postsRepository.removeLike(id, userId);
  // }

  // async addDislike(id: string, userId: string) {
  //   return await this.postsRepository.addDislike(id, userId);
  // }

  // async removeDislike(id: string, userId: string) {
  //   return await this.postsRepository.removeDislike(id, userId);
  // }

  // async checkLikeStatus(id: string, userId: string) {
  //   return await this.postsRepository.checkLikeStatus(id, userId);
  // }

  // async checkDislikeStatus(id: string, userId: string) {
  //   return await this.postsRepository.checkDislikeStatus(id, userId);
  // }

  async toggleLike(id: string, userId: string) {
    return await this.postsRepository.toggleLike(id, userId);
  }

  async toggleDislike(id: string, userId: string) {
    return await this.postsRepository.toggleDislike(id, userId);
  }
}
