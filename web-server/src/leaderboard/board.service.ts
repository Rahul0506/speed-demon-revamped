import { Injectable } from '@nestjs/common';
import { Leader } from './leader.interface';

@Injectable()
export class BoardService {
    getLeaders(): Leader[] {
        return [
            { name: 'A', time: 1.024 },
            { name: 'B', time: 0.24 },
        ];
    }
}
