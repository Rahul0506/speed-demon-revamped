import { Module } from '@nestjs/common';
import { BoardModule } from './leaderboard/board.module';
import { SubmitModule } from './submit/submit.module';

@Module({
    imports: [BoardModule, SubmitModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
