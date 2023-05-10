import { Controller, Get, Res, StreamableFile } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { Response } from 'express';

@Controller('file')
export class FileController {
  @Get()
  getFile(@Res() res: Response) {
    const file = fs.createReadStream(join(__dirname, 'store', 'file.json'));
    file.pipe(res);
  }
}
