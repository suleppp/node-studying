const Fastify = require('fastify');
const pp = require('pino-pretty');

const app = Fastify({
    logger: process.env.NODE_ENV === 'production' 
    ?
    {
        level: 'info'
    }
    :
    {
        level: 'debug',
        transport: {
            target: 'pino-pretty', // 格式化输出
            options: {
                colorize: true, // 彩色输出
                translateTime: 'SYS:standard' //时间格式化
            }
        }
    }
})


app.log.info("hello");
app.log.info("world");

app.log.warn("halo");