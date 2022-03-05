import { Controller, Get, Render } from '@nestjs/common';
import { BoardService } from './board.service';

@Controller()
export class BoardController {
    constructor(private readonly boardService: BoardService) {}

    @Get()
    @Render('index')
    async getBoard() {
        const leaders = await this.boardService.getLeaders();
        return { title: 'CS2040S AY21/22 Speed Demon Leaderboard', leaders };
    }
}
