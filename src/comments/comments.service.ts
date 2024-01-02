import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: string,
    postId: string,
  ): Promise<Comment> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const newComment = this.commentsRepository.create({
      ...createCommentDto,
      author: user,
      post: post,
    });
    return await this.commentsRepository.save(newComment);
  }

  async findAll(): Promise<Comment[]> {
    return await this.commentsRepository.find();
  }

  async findOne(id: string): Promise<Comment | undefined> {
    const comment = await this.commentsRepository.findOne({
      where: { id: id },
      relations: ['post', 'author'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const comment = await this.findOne(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (userId !== comment.author.id) {
      throw new UnauthorizedException(
        'You are not allowed to update this comment',
      );
    }

    this.commentsRepository.merge(comment, updateCommentDto);
    return await this.commentsRepository.save(comment);
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.findOne(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (userId !== comment.author.id) {
      throw new UnauthorizedException(
        'You are not allowed to delete this comment',
      );
    }

    await this.commentsRepository.remove(comment);
  }
}
