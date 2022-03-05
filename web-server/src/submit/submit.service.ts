import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class SubmitService {
    constructor(
        @Inject('REDIS_CLIENT') private readonly redisService: RedisService,
    ) {}

    async getQueueLen(): Promise<number> {
        return await this.redisService.getQueueLen();
    }
}
