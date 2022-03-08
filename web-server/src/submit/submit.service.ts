import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { RedisService } from 'src/redis/redis.service';
import { move } from 'fs-extra';
import { join } from 'path';

@Injectable()
export class SubmitService {
    constructor(
        @Inject('REDIS_CLIENT') private readonly redisService: RedisService,
    ) {}

    async getQueueLen(): Promise<number> {
        return await this.redisService.getQueueLen();
    }

    async processSubmission(
        req: Request,
        file: Express.Multer.File,
    ): Promise<string> {
        // Validate fields filled
        if (!req.body || !req.body.secret || !req.body.classname || !file) {
            throw Error('Missing Fields');
        }

        // Validate secret
        const secret: string = req.body.secret.trim();

        const name: string = await this.redisService.getNameBySecret(secret);
        if (name == null) {
            throw Error('Invalid  Secret');
        }

        // Valid file type
        var fileType;
        if (file.mimetype == 'application/x-zip-compressed') {
            fileType = 'zip';
        } else if (file.originalname.endsWith('.zip')) {
            fileType = 'zip';
        } else if (file.originalname.endsWith('.java')) {
            fileType = 'java';
        } else {
            throw Error('Invalid file type. Only .zip and .java allowed');
        }

        // Check previous submission in queue
        const inQueue = await this.redisService.checkQueue(secret);
        if (inQueue) {
            throw Error('Previous submission already in queue');
        }

        const srcPath = file.path;
        const destPath = join(
            __dirname,
            '..',
            '..',
            'uploads',
            file.filename,
            file.originalname,
        );
        try {
            await move(srcPath, destPath);
        } catch (err) {
            console.error(err);
        }

        // Send data to grader
        const data = {
            key: file.filename,
            classname: req.body.classname,
            name: name,
            secret: secret,
            type: fileType,
        };
        await Promise.all([
            this.redisService.setQueue(secret),
            this.redisService.setResult(file.filename),
            this.redisService.sendData(JSON.stringify(data)),
            this.redisService.notifyGrader(),
        ]);
        return data.key;
    }

    async fetchResult(id: string) {
        const jsonString: string = await this.redisService.getResult(id);
        if (jsonString == null) {
            throw Error('NF');
        } else if (jsonString == '') {
            throw Error('PE');
        }

        var json;
        try {
            json = JSON.parse(jsonString);
        } catch (err) {
            console.error(err);
            throw Error('JSON parsing error');
        }

        var board;
        if (json.success) {
            board = await this.redisService.getBoard();
        } else {
            board = [];
        }

        var scores = board
            .filter((elem, index) => index % 2)
            .map((str) => parseInt(str) / 1000);

        console.error(json.compileError || json.runtimeError);

        return {
            title: 'Submission Evaluated',
            correct: json.success,
            results: json.results,
            runtime: json.time / 1000,
            filename: json.classname,
            error: json.compileError,
            allTimes: JSON.stringify(scores),
        };
    }
}
