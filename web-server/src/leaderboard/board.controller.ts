import { Controller, Get, Render } from '@nestjs/common';
import { BoardService } from './board.service';

@Controller()
export class BoardController {
    constructor(private readonly boardService: BoardService) {}

    @Get()
    @Render('index')
    getBoard() {
        const leaders = this.boardService.getLeaders();
        return { leaders };
    }
}
