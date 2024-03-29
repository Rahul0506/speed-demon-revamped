export default () => ({
    port: parseInt(process.env.PORT, 10) || 8080,
    redis: {
        url: process.env.REDISCLOUD_URL || 'redis://localhost:6379',
    },
    redisConstants: {
        queueName: 'processQueue',
        pubSubName: 'processPubSub',
        leaderboardKey: 'leaderboard',
        secretNamesKey: 'secretName',
        inQueueKey: 'inQueue',
        resultsKey: 'results',
        revokedKey: 'revoked',
    },
});
