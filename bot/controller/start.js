const  Telegraf  = require('telegraf');
module.exports = async ctx => {
    ctx.setChatMenuButton(JSON.stringify({
        type: 'web_app',
        text: '🕹️ برنامه',
        web_app: { url: process.env.WEBAPP_URL +'/'+ ctx.user._id }}))
    ctx.reply('سلام به ربات پیکاپ خوش آومدید  اطلاعات خود را در برنامه کامل کنید و شروع به گپ زدن کنید', Telegraf.Markup.inlineKeyboard([Telegraf.Markup.button.webApp('برنامه' ,process.env.WEBAPP_URL +'/'+ ctx.user._id)]))
} 