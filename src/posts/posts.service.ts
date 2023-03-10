import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Post } from '@prisma/client';
import { Cache } from 'cache-manager';
import { PrismaService } from 'src/prisma/prisma.service';
import { GET_POST_CACHE_KEY } from './constants/postsCacheKey.constant';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';

@Injectable()
export class PostsService {
  constructor(
    private primsa: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys();
    keys.forEach((key) => {
      if (key.startsWith(GET_POST_CACHE_KEY)) {
        this.cacheManager.del(key);
      }
    });
  }

  async createPost(post: CreatePostDto): Promise<Post | null> {
    const newPost = await this.primsa.post.create({ data: post });
    await this.clearCache();
    return newPost;
  }

  async getPosts(userId?: string): Promise<Post[] | null> {
    let where: { authorId?: number } = {};
    if (userId) where.authorId = parseInt(userId);
    return await this.primsa.post.findMany({ where });
  }

  async deletePost(postId: string) {
    return {};
  }

  // private lastPostId = 0;
  // private posts: Post[] = [];

  // getAllPosts() {
  //   return this.posts;
  // }

  // getPostById(id: number) {
  //   const post = this.posts.find((post) => post.id === id);
  //   if (post) {
  //     return post;
  //   }
  //   throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  // }

  // replacePost(id: number, post: UpdatePostDto) {
  //   const postIndex = this.posts.findIndex((post) => post.id === id);
  //   if (postIndex > -1) {
  //     this.posts[postIndex] = post;
  //     return post;
  //   }
  //   throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  // }

  // createPost(post: CreatePostDto) {
  //   const newPost = {
  //     id: ++this.lastPostId,
  //     ...post,
  //   };
  //   this.posts.push(newPost);
  //   return newPost;
  // }

  // deletePost(id: number) {
  //   const postIndex = this.posts.findIndex((post) => post.id === id);
  //   if (postIndex > -1) {
  //     this.posts.splice(postIndex, 1);
  //   } else {
  //     throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  //   }
  // }
}
