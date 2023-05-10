import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  MessageEvent,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Sse,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { interval, map, Observable } from 'rxjs';
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
  
  @Put(':id')
  updateUser(@Param('id', ParseIntPipe) id: number){
    return this.userService.updateUser(id)
  }

  // @Sse('sse')
  sse(): Observable<MessageEvent> {
    return interval(1000).pipe(map((_) => ({ data: { hello: 'world' } })));
  }

  @Put(':id/push/enable')
  @HttpCode(HttpStatus.OK)
  async enablePush(@Body() update_dto: any, @Param('id', ParseIntPipe) user_id: number) {
    return await this.userService.enablePush(user_id, update_dto);
  }

  @Put(':id/push/disable')
  @HttpCode(HttpStatus.OK)
  async disablePush(@Param('id') user_id: number, @Body() update_dto: any) {
    return await this.userService.disablePush(user_id, update_dto);
  }

  @Get('push/notifications')
  @HttpCode(HttpStatus.OK)
  async fetchPusNotifications() {
    return await this.userService.getPushNotifications();
  }
}
