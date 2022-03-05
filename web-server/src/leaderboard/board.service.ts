import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { Leader } from './leader.interface';

@Injectable()
export class BoardService {
    constructor(
        @Inject('REDIS_CLIENT') private readonly redisService: RedisService,
    ) {}

    getLeaders(): Promise<Leader[]> {
        return this.redisService.getLeaders();
    }
}
