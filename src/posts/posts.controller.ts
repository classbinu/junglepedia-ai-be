import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import * as crypto from 'crypto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: any) {
    const userId = req.user['sub'];
    createPostDto.author = userId;

    const hash = crypto.createHash('sha256');
    hash.update(createPostDto.content);
    createPostDto.hash = hash.digest('hex');

    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('search')
  findOneByField(@Query('field') field: string, @Query('value') value: string) {
    return this.postsService.findOneByField(field, value);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: any,
  ) {
    const userId = req.user['sub'];
    const post = await this.postsService.findOne(id);
    const author = post.author.toString();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (userId !== author) {
      throw new UnauthorizedException(
        'You are not allowed to update this post',
      );
    }
    return this.postsService.update(id, updatePostDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user['sub'];
    const post = await this.postsService.findOne(id);
    const author = post.author.toString();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (userId !== author) {
      throw new UnauthorizedException(
        'You are not allowed to delete this post',
      );
    }

    return this.postsService.remove(id);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':id/like')
  async toggleLike(@Param('id') id: string, @Req() req: any) {
    const userId = req.user['sub'];
    const post = await this.postsService.findOne(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.postsService.toggleLike(id, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':id/dislike')
  async toggleDislike(@Param('id') id: string, @Req() req: any) {
    const userId = req.user['sub'];
    const post = await this.postsService.findOne(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.postsService.toggleDislike(id, userId);
  }
}
