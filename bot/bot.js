const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters')
const path = require('path');
const schedule = require('node-schedule')
const dailyCoin = require('./controller/dailyCoin')
const redisController= require('./controller/redis')

const checkJoinMiddleware = require('./middleware/checkJoin')
const mediaController = require('./controller/media')

const startController = require('./controller/start')
const messageController = require('./controller/message')
const userDataMw = require('./middleware/userData')
const redis = require('redis');
const axios = require('axios');
const checkConnection = require('./middleware/checkConnection');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(checkJoinMiddleware)
schedule.scheduleJob('* */5 * * *', async () => dailyCoin(bot));

bot.use(userDataMw)

bot.start(startController)

bot.use(checkConnection)

bot.on(message('text'),messageController)
bot.on(message('photo'),mediaController.photo);
bot.on(message('voice'),mediaController.voice);
bot.on(message('animation'),mediaController.animation);
bot.on(message('audio'),mediaController.audio);
bot.on(message('sticker'),mediaController.sticker);
bot.on(message('video'),mediaController.video);
bot.on(message(),mediaController.other);



(async () => {

    const client = redis.createClient({
        url: process.env.REDIS_URL
    })
    client.on('error', err => console.log('Redis Client Error', err))
    client.connect()

    const subscriber = client.duplicate();
    await subscriber.connect();

    await subscriber.subscribe('connection', redisController.connection(bot));

    await subscriber.subscribe('disConnection', redisController.disConnection(bot));
    await subscriber.subscribe('notFound', redisController.notFound(bot))
    await subscriber.subscribe('sendInvite', redisController.sendInvite(bot))
})(); 

module.exports = bot