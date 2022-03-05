import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { BoardModule } from './leaderboard/board.module';
import { RedisModule } from './redis/redis.module';
import { SubmitModule } from './submit/submit.module';

@Module({
    imports: [
        ConfigModule.forRoot({ load: [config], isGlobal: true }),
        RedisModule,
        BoardModule,
        SubmitModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
