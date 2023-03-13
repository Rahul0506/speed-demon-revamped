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
import { isValid } from 'shortid';
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
    async uploadSubmission(
        @Req() req: Request,
        @Res() res: Response,
        @UploadedFile() file: Express.Multer.File,
    ) {
        console.log(file.mimetype);
        console.log(file.originalname);
        console.log(file.path);

        try {
            const id = await this.submitService.processSubmission(req, file);
            res.redirect(`/submission/${id}`);
        } catch (err) {
            return res.render('upload', {
                title: 'New Submission',
                error: err.message,
            });
        }
    }

    @Get('/submission/:id')
    async viewSubmission(@Param() params, @Res() res: Response) {
        const id = params.id;

        const queueLen = await this.submitService.getQueueLen();
        if (!isValid(id)) {
            return res.render('notfound', {
                title: 'Submission Not Found',
                queueNumber: queueLen,
            });
        }

        try {
            const result = await this.submitService.fetchResult(id);

            return res.render('judged', result);
        } catch (err) {
            const msg: string = err.message;
            if (msg == 'NF') {
                return res.render('notfound', {
                    title: 'Submission Not Found',
                    queueNumber: queueLen,
                });
            } else if (msg == 'PE') {
                return res.render('pending', {
                    title: 'Submission Pending',
                    queueNumber: queueLen,
                });
            } else {
                return res.render('error', {
                    message: 'Internal Server Error',
                    error: 'Please contact',
                });
            }
        }
    }
}
