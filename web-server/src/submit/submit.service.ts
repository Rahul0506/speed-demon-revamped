import { Injectable } from '@nestjs/common';

@Injectable()
export class SubmitService {
    async getQueueLen(): Promise<number> {
        return 10;
    }
}
