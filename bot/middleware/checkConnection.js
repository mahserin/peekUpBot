const model = require('./../model/connection');
module.exports = async (ctx , next) => {
    const connection = await model.findOne({ $or: [{ joinedUser: ctx.user._id }, { creatorUser: ctx.user._id }], closed: false }).populate('joinedUser creatorUser')
    if(!connection) return ctx.reply('متوجه منظورتون نشدم \n\n اگر در حال مکالمه با کسی بودید ، آن شخص چت را به اتمام رسانده است  \n\n  شما می توانید از دکمه زیر چت دیگری را شروع کنید')
    if (ctx.user._id.toString() == connection.joinedUser._id.toString()) {
ctx.connection = connection.creatorUser
return next()
}
ctx.connection = connection.joinedUser
return next()
}