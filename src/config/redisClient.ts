import { Redis } from 'ioredis';

const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
});

redis.on('error', (err: Error) => console.error('Redis Error:', err));

export default redis;
