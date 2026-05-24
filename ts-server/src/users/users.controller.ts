import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { StorageService } from 'src/storage/storage.service';
import { Request } from 'express';

const MAX_BYTES = 5 * 1024 * 1024;

@Controller('uploads')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly storageService: StorageService,
  ) {}

  @Post('avatar')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_BYTES },
    }),
  )
  async uploadAvatar(@UploadedFile() file: Express.Multer.File | undefined, @Req() req: Request) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Expected multipart field "file" with image body.');
    }

    const jwtUser = req.user as { id: string; username: string };
    try {   
      const publicUrl = await this.storageService.uploadUserAvatar(jwtUser.id, file.buffer, file.mimetype);
      const user = await this.usersService.updateUserAvatar(jwtUser.id, publicUrl);
      return {
        id: user.id,
        username: user.username,
        bio: user.bio ?? null,
        avatarUrl: user.avatarUrl ?? null,
      };
    } catch (error) {
      throw new BadRequestException('Failed to upload avatar: ' + error.message);
    }
  }
}
