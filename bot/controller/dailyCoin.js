const userModel = require('./../model/user')
module.exports = async (bot) => {
    const users = await userModel.find({coin : {$lt : 2}})
    users?.forEach( async user => {
        let random = Math.floor(Math.random() * 4) 
        await userModel.findByIdAndUpdate(user._id , {$inc : {coin : 2}})
        bot.telegram.sendMessage(user.uid , '🎁 2 سکه، پاداش شما دریافت شد\n\n این پاداش هر 5 ساعت در صورت نداشتن سکه تعلق میگیرد😊')
    });
}