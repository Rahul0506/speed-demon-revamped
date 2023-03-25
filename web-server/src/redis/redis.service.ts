import { Injectable } from '@nestjs/common';
import * as redis from 'redis';
import { Leader } from 'src/leaderboard/leader.interface';

interface Constants {
    queueName: string;
    pubSubName: string;
    leaderboardKey: string;
    secretNamesKey: string;
    inQueueKey: string;
    resultsKey: string;
    revokedKey: string;
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
    }

    getBoard() {
        return this.client.ZRANGE_WITHSCORES(
            this.constants.leaderboardKey,
            0,
            -1,
        );
    }

    getQueueLen(): Promise<number> {
        return this.client.LLEN(this.constants.queueName);
    }

    getNameBySecret(secret: string): Promise<string> {
        return this.client.HGET(this.constants.secretNamesKey, secret);
    }

    checkQueue(secret: string) {
        return this.client.SISMEMBER(this.constants.inQueueKey, secret);
    }

    checkRevoked(secret: string) {
        return this.client.SISMEMBER(this.constants.revokedKey, secret);
    }

    async setQueue(secret: string) {
        await this.client.SADD(this.constants.inQueueKey, secret);
    }

    async setResult(subId: string) {
        await this.client.HSET(this.constants.resultsKey, subId, '');
    }

    getResult(subId: string) {
        return this.client.HGET(this.constants.resultsKey, subId);
    }

    async sendData(jsonString: string) {
        await this.client.LPUSH(this.constants.queueName, jsonString);
    }

    async notifyGrader() {
        this.client.PUBLISH(this.constants.pubSubName, 'new');
    }
}
