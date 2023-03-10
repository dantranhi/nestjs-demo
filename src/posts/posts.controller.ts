import {
  Body,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/guard/jwt-authentication.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpCacheInterceptor } from 'src/utils/httpCache.interceptor';
import { GET_POST_CACHE_KEY } from './constants/postsCacheKey.constant';
import { CreatePostDto } from './dto/createPost.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private prisma: PrismaService,
  ) {}

  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey(GET_POST_CACHE_KEY)
  @CacheTTL(120)
  @Get('')
  getAllPosts(@Query() params: { userId?: string }) {
    return this.postsService.getPosts(params.userId);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('')
  async createPost(@Body() post: CreatePostDto) {
    return this.postsService.createPost(post);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':id')
  async deletePost(@Param() params: { postId: string }){
    return this.postsService.deletePost(params.postId)
  }
}
