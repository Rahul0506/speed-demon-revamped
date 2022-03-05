import { Injectable } from '@nestjs/common';
import * as redis from 'redis';
import { Leader } from 'src/leaderboard/leader.interface';

interface Constants {
    queueName: string;
    pubSubName: string;
    leaderboardKey: string;
}

@Injectable()
export class RedisService {
    private client: redis.RedisClientType;
    private constants: Constants;

    constructor(url: string, consts: Constants) {
        this.client = redis.createClient({
            url: url,
        });
        this.constants = consts;
        this.client.on('error', (err) => console.error(err));
        this.client.on('ready', function () {
            console.log('Connected to redis');
        });
    }

    async init() {
        await this.client.connect();
    }

    async getLeaders(): Promise<Leader[]> {
        console.log(this.constants.leaderboardKey);
        try {
            const results = await this.client.ZRANGE_WITHSCORES(
                this.constants.leaderboardKey,
                0,
                15,
            );

            const leaders: Leader[] = [];
            results.forEach((element) => {
                if (element.value) {
                    leaders.push({
                        name: element.value,
                        time: element.score / 1000,
                    });
                }
            });
            return leaders;
        } catch (err) {
            console.log('Oh no');
            console.error(err);
        }
    }

    getQueueLen(): Promise<number> {
        return this.client.LLEN(this.constants.queueName);
    }
}
