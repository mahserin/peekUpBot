const fs = require('fs');
const axios = require('axios');
const telegraf = require('telegraf');
exports.photo = async ctx => {
    ctx.telegram.sendPhoto(ctx.connection.uid ,ctx.update.message.photo[ctx.update.message.photo.length - 1].file_id , {caption : ctx.update.message.caption})
    const file = await ctx.telegram.getFile(ctx.update.message.photo[ctx.update.message.photo.length - 1].file_id)
    const fileData = await axios(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`, { responseType:"arraybuffer" } )
    const buffer = Buffer.from(fileData.data, 'base64');
    fs.writeFileSync(`./public/images/${file.file_id +'-'+ file.file_path.split('/').slice(-1)}` ,buffer)
}

exports.voice = async ctx => {
    ctx.telegram.sendVoice(ctx.connection.uid ,ctx.update.message.voice.file_id , {caption : ctx.update.message.caption})
}
exports.animation = async ctx => {
    ctx.telegram.sendAnimation(ctx.connection.uid ,ctx.update.message.animation.file_id , {caption : ctx.update.message.caption})
}
exports.audio = async ctx => {
    ctx.telegram.sendAudio(ctx.connection.uid ,ctx.update.message.audio.file_id , {caption : ctx.update.message.caption})
}
exports.sticker = async ctx => {
    ctx.telegram.sendSticker(ctx.connection.uid ,ctx.update.message.sticker.file_id , {caption : ctx.update.message.caption})
}

exports.video = async ctx => {
    ctx.telegram.sendVideo(ctx.connection.uid ,ctx.update.message.video.file_id , {caption : ctx.update.message.caption})
    const file = await ctx.telegram.getFile(ctx.update.message.video.file_id)
    const fileData = await axios(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`, { responseType:"arraybuffer" } )
    const buffer = Buffer.from(fileData.data, 'base64');
    fs.writeFileSync(`./public/videos/${file.file_id +'-'+ file.file_path.split('/').slice(-1)}` ,buffer)
}
exports.other =  async ctx => {
    ctx.reply('ارسال این نوع از فایل غیر مجاز است', { reply_to_message_id: ctx.update.message.message_id });
}