const model = require('./../model/user')
module.exports = async (ctx , next) => {
    const userInfo = ctx.update.message.from
    const user = model.findOne({uid : userInfo.id})
    if(user) {
        return next()
    }
    await model.create({
        uid : userInfo.id ,
        Fname : userInfo.first_name,
        username : userInfo.username ,
        Lname : userInfo.last_name
    })
    return next()
}