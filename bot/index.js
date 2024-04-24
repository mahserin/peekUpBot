const bot = require('./bot')
const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config({path : path.join(__dirname , '../.env')});

(() => {
mongoose.connect(process.env.DB_URL).then(() => {
    console.log('connected to database');
}).catch(err => console.log(err))
})()



bot.launch()

// process.once('SIGINT', () => bot.stop('SIGINT'))
// process.once('SIGTERM', () => bot.stop('SIGTERM'))