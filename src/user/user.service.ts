import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({ where: { email } });
    return user;
  }

  async getById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (user) return user;
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async createUser(user: CreateUserDto): Promise<User> {
    try {
      const hash = await bcrypt.hash(user.password, 10);
      return await this.prisma.user.create({
        data: { ...user, password: hash },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new ForbiddenException('User with that email already exists');

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: currentHashedRefreshToken },
    });
  }

  async removeRefreshToken(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async addAvatar(userId: number, file: Express.Multer.File) {
    try {
      await this.prisma.$transaction(
        async (tx) => {
          const user = await tx.user.findFirst({ where: { id: userId } });
          if (user.avatarPublicId)
            await this.cloudinary.deleteFile(user.avatarPublicId);
          const { url, public_id } = await this.cloudinary.uploadImage(file);
          await tx.user.update({
            where: { id: userId },
            data: { avatarUrl: url, avatarPublicId: public_id },
          });
        },
        {
          maxWait: 20000, // default: 2000
          timeout: 60000, // default: 5000
        },
      );
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Invalid file type.');
    }
  }
}
