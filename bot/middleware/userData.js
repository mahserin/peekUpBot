const userModel = require('./../model/user')
const configModel = require('./../model/config')

module.exports = async (ctx , next) => {
    const userInfo = ctx.update.message.from
    const user = await userModel.findOne({uid : userInfo.id})
    if(user) {
        ctx.user = user
        return next()
    }
    const newConfig = await configModel.create({})
    const newUser = await userModel.create({
        uid : userInfo.id ,
        Fname : userInfo.first_name,
        username : userInfo.username ,
        Lname : userInfo.last_name,
        config : newConfig._id,
        token : await configModel.countDocuments() + 100000
    })
    ctx.user = newUser
    return next()
}