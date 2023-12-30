import { User, UserDocument } from './schema/user.schema';

import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';

export interface UsersRepository {
  create(createUserDto: CreateUserDto);
  findAll();
  findOne(id: string);
  findOneByField(field: string, value: string);
  update(id: string, updateUserDto: UpdateUserDto);
  remove(id: string);
}

@Injectable()
export class UsersMongoRepository implements UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async findAll() {
    return await this.userModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    return await this.userModel.findById(id).exec();
  }

  async findOneByField(field: string, value: string) {
    const query = { [field]: value };
    return await this.userModel.findOne(query).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id).exec();
  }
}
