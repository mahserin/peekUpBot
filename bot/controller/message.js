
module.exports = async ctx => {
    

        ctx.telegram.sendMessage(ctx.connection.uid, ctx.message.text)


}