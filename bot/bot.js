const {Telegraf} = require('telegraf');
const path = require('path');

const startController = require('./controller/start')
const userDataMw = require('./middleware/userData')

require('dotenv').config({path : path.join(__dirname , '../.env')});

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(userDataMw , startController)


module.exports = bot