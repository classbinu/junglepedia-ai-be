import * as crypto from 'crypto';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/Comment.entity';
import { LangchainService } from 'src/langchain/langchain.service';
import { CommentsService } from 'src/comments/comments.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly commentsService: CommentsService,
    private readonly langchainService: LangchainService,
  ) {}

  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const hash = crypto.createHash('sha256');
    const newPost = this.postsRepository.create({
      ...createPostDto,
      author: user,
    });

    hash.update(createPostDto.content);
    newPost.hash = hash.digest('hex');

    const createdPost = await this.postsRepository.save(newPost);

    const isAskAI = true;
    if (isAskAI) {
      await this.createAiFeedbackComment(createdPost);
    }

    return createdPost;
  }

  async createAiFeedbackComment(createdPost: any): Promise<Comment> {
    const langchainDto = {
      messages: createdPost.content,
    };

    const res = await this.langchainService.post(langchainDto);
    const AiMessage = res.lc_kwargs.content;

    const createCommentDto = {
      content: AiMessage,
      postId: createdPost.id,
    };

    const aiUserId = '70f043a5-e51e-4743-a62e-2e65a166cf38'; // 현재 임시. AI user id
    return await this.commentsService.create(createCommentDto, aiUserId);
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find();
  }

  async findOne(id: string): Promise<Post | undefined> {
    const post = await this.postsRepository.findOne({
      where: { id: id },
      relations: ['author'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async findCommentsByPostId(id: string): Promise<Comment[]> {
    const comments = await this.commentsRepository.find({
      where: { post: { id: id } },
      relations: ['author'],
    });

    return comments;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<Post> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const post = await this.postsRepository.findOne({ where: { id: id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (userId !== post.author.toString()) {
      throw new UnauthorizedException(
        'You are not allowed to update this post',
      );
    }

    if (updatePostDto.content && updatePostDto.content !== post.content) {
      const hash = crypto.createHash('sha256');
      hash.update(updatePostDto.content);
      post.hash = hash.digest('hex');
    }

    this.postsRepository.merge(post, updatePostDto);
    return await this.postsRepository.save(post);
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.findOne(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (userId !== post.author.id) {
      throw new UnauthorizedException(
        'You are not allowed to delete this post',
      );
    }

    await this.postsRepository.remove(post);
  }
}
