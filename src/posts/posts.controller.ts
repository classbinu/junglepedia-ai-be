import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Optional,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: any) {
    const userId = req.user['sub'];
    return this.postsService.create(createPostDto, userId);
  }

  @ApiQuery({
    name: 'author',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'isPrivate',
    required: false,
    type: Boolean,
  })
  @Get()
  findAll(
    @Query('author') @Optional() author?: string | null,
    @Query('offset') @Optional() offset?: number,
    @Query('limit') @Optional() limit?: number,
    @Query('isPrivate') @Optional() isPrivate?: boolean,
  ) {
    return this.postsService.findAll(author, offset, limit, isPrivate);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @Get('/my')
  findMy(
    @Req() req: any,
    @Query('offset') @Optional() offset?: number,
    @Query('limit') @Optional() limit?: number,
  ) {
    const userId = req.user['sub'];
    return this.postsService.findMy(userId, offset, limit);
  }

  // @Get('search')
  // findOneByField(@Query('field') field: string, @Query('value') value: string) {
  //   return this.postsService.findOneByField(field, value);
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Get(':id/comments')
  findCommentsByPostId(@Param('id') id: string) {
    return this.postsService.findCommentsByPostId(id);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: any,
  ) {
    const userId = req.user['sub'];
    return this.postsService.update(id, updatePostDto, userId);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user['sub'];
    return this.postsService.remove(id, userId);
  }

  @ApiBearerAuth()
  @Get(':id/like')
  async getLikes(@Param('id') id: string) {
    return this.postsService.getLikes(id);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Post(':id/like')
  async toggleLike(@Param('id') id: string, @Req() req: any) {
    const userId = req.user['sub'];
    return this.postsService.toggleLike(id, userId);
  }

  @ApiBearerAuth()
  @Get(':id/dislike')
  async getDislikes(@Param('id') id: string) {
    return this.postsService.getDislikes(id);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Post(':id/dislike')
  async toggleDislike(@Param('id') id: string, @Req() req: any) {
    const userId = req.user['sub'];
    return this.postsService.toggleDislike(id, userId);
  }
}
