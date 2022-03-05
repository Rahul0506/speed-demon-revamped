import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { SubmitController } from './submit.controller';
import { SubmitService } from './submit.service';

@Module({
    imports: [RedisModule],
    controllers: [SubmitController],
    providers: [SubmitService],
})
export class SubmitModule {}
