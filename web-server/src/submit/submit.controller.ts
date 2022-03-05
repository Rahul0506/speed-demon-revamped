import {
    Controller,
    Get,
    Param,
    Post,
    Render,
    Req,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { storageOptions } from 'src/config/storage.config';
import { SubmitService } from './submit.service';

@Controller()
export class SubmitController {
    constructor(private readonly submitService: SubmitService) {}

    @Get('/submit')
    @Render('upload')
    async getSubmitPanel() {
        const queueLength = await this.submitService.getQueueLen();
        return { title: 'New Submission', queueLength };
    }

    @Post('/submit')
    @UseInterceptors(FileInterceptor('file', { storage: storageOptions }))
    uploadSubmission(
        @Req() req: Request,
        @Res() res: Response,
        @UploadedFile() file: Express.Multer.File,
    ) {
        console.log(file.originalname);
        console.log(file.filename);
        console.log(file.path);
        const id = file.filename;
        res.redirect(`/submission/${id}`);
    }

    @Get('/submission/:id')
    viewSubmission(@Param() params, @Res() res: Response) {
        console.log(params.id);
        return res.render('judged', {
            title: 'Submission Evaluated',
            filename: params.id,
        });
    }
}
