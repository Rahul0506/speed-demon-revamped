import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

const factory = {
    provide: 'REDIS_CLIENT',
    useFactory: async (confService: ConfigService) => {
        const service = new RedisService(
            confService.get('redis.url'),
            confService.get('redisConstants'),
        );
        await service.init();
        return service;
    },
    inject: [ConfigService],
};

@Module({
    providers: [factory],
    exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
