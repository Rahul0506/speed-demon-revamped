import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller()
export class FileController {
    @Get('woopwoop/:filename')
    getFile(@Param('filename') filename: string, @Res() res: Response) {
        const file = createReadStream(
            join(__dirname, '..', '..', 'temp', filename),
        );
        file.pipe(res);
    }
}
