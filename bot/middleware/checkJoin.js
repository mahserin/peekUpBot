const Telegraf = require('telegraf')
module.exports = async (ctx , next) => {
    const chatMember = await ctx.telegram.getChatMember('@peekupchannel',ctx.message.from.id)
    if(chatMember.status == 'left') {
        return ctx.reply('سلام دوست عزیز ، برای استفاده از ربات لطفا اول وارد کانال ما بشین \n\n با تشکر' , Telegraf.Markup.inlineKeyboard([Telegraf.Markup.button.url( 'کانال پیکاپ','https://t.me/peekupchannel')]))

    }
    next()
}