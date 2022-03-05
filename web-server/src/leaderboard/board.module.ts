import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
    imports: [RedisModule],
    controllers: [BoardController],
    providers: [BoardService],
})
export class BoardModule {}
