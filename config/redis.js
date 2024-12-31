import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: '4cA45xeEpHGRaYLaWLhvvTuDrEK7dBjB',
    socket: {
        host: 'redis-13714.c83.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 13714
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)  // >>> bar

