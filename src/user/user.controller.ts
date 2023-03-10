import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GetUser } from 'src/auth/decorator';
import JwtAuthenticationGuard from 'src/auth/guard/jwt-authentication.guard';
import PermissionGuard from 'src/auth/guard/permission.guard';
import Permission from 'src/type/permission.type';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('avatar')
  @UseGuards(PermissionGuard(Permission.UPDATE_AVATAR))
  @UseInterceptors(FileInterceptor('image'))
  async addAvatar(
    @GetUser('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.userService.addAvatar(id, file);
    return { success: true, message: 'Avatar added successfully' };
  }
}
