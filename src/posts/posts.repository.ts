import { Post, PostDocument } from './schema/post.schema';

import { CreatePostDto } from './dto/create-post.dto';
import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';

export interface PostsRepository {
  create(createPostDto: CreatePostDto);
  findAll();
  findOne(id: string);
  findOneByField(field: string, value: string);
  update(id: string, updatePostDto: UpdatePostDto);
  remove(id: string);

  addLike(id: string, userId: string);
  removeLike(id: string, userId: string);
  addDislike(id: string, userId: string);
  removeDislike(id: string, userId: string);
  checkLikeStatus(id: string, userId: string);
  checkDislikeStatus(id: string, userId: string);
  toggleLike(id: string, userId: string);
  toggleDislike(id: string, userId: string);
}

@Injectable()
export class PostsMongoRepository implements PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostDto: CreatePostDto) {
    const createdPost = new this.postModel(createPostDto);
    return await createdPost.save();
  }

  async findAll() {
    return await this.postModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    return await this.postModel.findById(id).exec();
  }

  async findOneByField(field: string, value: string) {
    const query = { [field]: value };
    return await this.postModel.findOne(query).exec();
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    return await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return await this.postModel.findByIdAndDelete(id).exec();
  }

  async addLike(id: string, userId: string) {
    const objectId = new mongoose.Types.ObjectId(userId);
    return await this.postModel.findByIdAndUpdate(
      id,
      { $addToSet: { likes: objectId } },
      { new: true },
    );
  }

  async removeLike(id: string, userId: string) {
    const objectId = new mongoose.Types.ObjectId(userId);
    return await this.postModel.findByIdAndUpdate(
      id,
      { $pull: { likes: objectId } },
      { new: true },
    );
  }

  async addDislike(id: string, userId: string) {
    const objectId = new mongoose.Types.ObjectId(userId);
    return await this.postModel.findByIdAndUpdate(
      id,
      { $addToSet: { dislikes: objectId } },
      { new: true },
    );
  }

  async removeDislike(id: string, userId: string) {
    const objectId = new mongoose.Types.ObjectId(userId);
    return await this.postModel.findByIdAndUpdate(
      id,
      { $pull: { dislikes: objectId } },
      { new: true },
    );
  }

  async checkLikeStatus(id: string, userId: string) {
    const objectId = new mongoose.Types.ObjectId(userId);
    return await this.postModel.findOne({ _id: id, likes: objectId });
  }

  async checkDislikeStatus(id: string, userId: string) {
    const objectId = new mongoose.Types.ObjectId(userId);
    return await this.postModel.findOne({ _id: id, dislikes: objectId });
  }

  async toggleLike(id: string, userId: string) {
    if (await this.checkLikeStatus(id, userId)) {
      return await this.removeLike(id, userId);
    } else {
      return await this.addLike(id, userId);
    }
  }

  async toggleDislike(id: string, userId: string) {
    if (await this.checkDislikeStatus(id, userId)) {
      return await this.removeDislike(id, userId);
    } else {
      return await this.addDislike(id, userId);
    }
  }
}
