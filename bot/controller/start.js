const userModel = require('./../model/user')
module.exports = async ctx => {
    console.log(ctx.update.message.from);

    ctx.reply('سلام')
}