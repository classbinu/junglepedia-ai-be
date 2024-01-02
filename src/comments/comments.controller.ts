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
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: any) {
    const userId = req.user['sub'];
    const postId = createCommentDto.postId;
    return this.commentsService.create(createCommentDto, userId, postId);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  // @Get('search')
  // findOneByField(@Query('field') field: string, @Query('value') value: string) {
  //   return this.postsService.findOneByField(field, value);
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdateCommentDto,
    @Req() req: any,
  ) {
    const userId = req.user['sub'];
    return this.commentsService.update(id, updatePostDto, userId);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user['sub'];
    return this.commentsService.remove(id, userId);
  }
}
