exports.connection = (bot) => {
    return (message) => {

        const data = JSON.parse(message)
        bot.telegram.sendMessage(data.joinedUser.uid, `-------------------------------------\n                          شما به ${data.creatorUser.nickName} وصل شدید\n-------------------------------------`)
        bot.telegram.sendMessage(data.creatorUser.uid, `-------------------------------------\n                           شما به ${data.joinedUser.nickName} وصل شدید\n-------------------------------------`)
    }
}

exports.disConnection = bot => {
    return message => {
        const data = JSON.parse(message)
        bot.telegram.sendMessage(data.joinedUser.uid, `-------------------------------------\n                          اتصال شما از ${data.creatorUser.nickName} قطع شد\n-------------------------------------`)
        bot.telegram.sendMessage(data.creatorUser.uid, `-------------------------------------\n                           اتصال شما از ${data.joinedUser.nickName} قطع شد\n-------------------------------------`)
    }
}

exports.notFound = bot => {
    return message => {
        bot.telegram.sendMessage(message , 'ℹ️ کسی برای شما پیدا نشد \n\n دوباره جستوجو کنید یا از فیلتر های اعمال شده کم کنید')
    }
}
exports.sendInvite = bot => {
    return message => {

        bot.telegram.sendMessage(message.uid , )
    }
}