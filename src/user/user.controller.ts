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
import Role from 'src/enums/role.enum';
import RoleGuard from 'src/guards/role.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('avatar')
  @UseGuards(RoleGuard(Role.ADMIN))
  @UseInterceptors(FileInterceptor('image'))
  async addAvatar(
    @GetUser('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.userService.addAvatar(id, file);
    return { success: true, message: 'Avatar added successfully' };
  }
}
