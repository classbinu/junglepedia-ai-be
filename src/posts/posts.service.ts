import * as crypto from 'crypto';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/postLike.entity';
import { Repository } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/Comment.entity';
import { LangchainService } from 'src/langchain/langchain.service';
import { CommentsService } from 'src/comments/comments.service';
import { PostDislike } from './entities/postDislike.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    @InjectRepository(PostDislike)
    private readonly postDislikeRepository: Repository<PostDislike>,

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
    const questionSet = `
    """
    면접 질문: ${createdPost.title}
    """ 

    """
    면접 답변: ${createdPost.content}
    """}
    `;
    const langchainDto = {
      messages: questionSet,
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

  async findAll(
    author: string | null,
    offset: number = 0,
    limit: number = 20,
    isPrivate = false,
  ): Promise<Post[]> {
    const whereCondition = {
      isPrivate: isPrivate,
    };

    if (author) {
      whereCondition['author'] = { id: author };
    }
    return await this.postsRepository.find({
      where: whereCondition,
      order: {
        createdAt: -1,
      },
      skip: offset,
      take: limit,
    });
  }

  async findMy(
    userId: string,
    offset: number = 0,
    limit: number = 20,
  ): Promise<Post[]> {
    return await this.postsRepository.find({
      where: {
        author: { id: userId },
      },
      order: {
        createdAt: -1,
      },
      skip: offset,
      take: limit,
    });
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
      order: { createdAt: 1 },
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

    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (userId !== post.author.id) {
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

  async like(id: string, userId: string): Promise<PostLike> {
    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const like = await this.postLikeRepository.findOne({
      where: { post: { id: id }, user: { id: userId } },
    });

    const likesCount = await this.postLikeRepository.count({
      where: { post: { id: id } },
    });

    if (like) {
      await this.update(id, { likesCount: likesCount - 1 }, userId);
      return await this.postLikeRepository.remove(like);
    } else {
      await this.update(id, { likesCount: likesCount + 1 }, userId);
      const newLike = this.postLikeRepository.create({
        user: user,
        post: post,
      });
      return await this.postLikeRepository.save(newLike);
    }
  }

  async dislike(id: string, userId: string): Promise<PostLike> {
    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const dislike = await this.postDislikeRepository.findOne({
      where: { post: { id: id }, user: { id: userId } },
    });

    const dislikesCount = await this.postDislikeRepository.count({
      where: { post: { id: id } },
    });

    if (dislike) {
      await this.update(id, { dislikesCount: dislikesCount - 1 }, userId);
      return await this.postDislikeRepository.remove(dislike);
    } else {
      await this.update(id, { dislikesCount: dislikesCount + 1 }, userId);
      const newDisLike = this.postDislikeRepository.create({
        user: user,
        post: post,
      });
      return await this.postDislikeRepository.save(newDisLike);
    }
  }
}
