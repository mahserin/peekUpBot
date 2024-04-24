const userModel = require('./../model/user')
const searchModel = require('./../model/search')
const connectionModel = require('./../model/connection')
const redis = require('redis');
const redisClient = redis.createClient({
url : process.env.REDIS_URL
    })
    redisClient.on('error', err => console.log('Redis Client Error', err)).connect()

exports.connect = (io, socket) => {
    const searchForSomeone = async arg => {
        const user = await userModel.findById(arg).populate('config')
        const config = { nearAge: user.config.nearAge, nearCity: user.config.nearCity, sex: user.config.sex }
        let userCost = 0
        if (config.sex != 'random') {
            userCost += 2
        }
        userCost += Number(config.nearCity)
        userCost += Number(config.nearAge)

        if (userCost > user.coin) return io.to(user.socketId).emit('coin:scant')

        const meInSearch = await searchModel.findOne({ 'me._id': user._id })
        if (meInSearch) return console.log('me in search')

        io.to(user.socketId).emit('searching')

        let match = {}
        if (config.sex == 'male' || config.sex == 'female') match = { "me.sex": config.sex }
        match['$or'] = [{ 'you.sex': 'random' }, { 'you.sex': user.sex }]


        const distanceAggregate = [{
            $addFields: {
                cityDistance: { $sqrt: [{ $sum: [{ $pow: [{ $subtract: [{ $toDouble: "$me.city.latitude" }, +user.city.latitude] }, 2] }, { $pow: [{ $subtract: [{ $toDouble: "$me.city.longitude" }, +user.city.longitude] }, 2] }] }] },
                ageDistance: { $abs: { $subtract: ['$me.age', user.age] } }

            }
        }, { $addFields: { mulca: { $multiply: ['$ageDistance', '$cityDistance'] } } }]

        const sort = {}
        let sortConds = {}
        if (config.nearAge && config.nearCity) {
            match.ageDistance = { $lte: ["$ageDistance", 3] }
            match.cityDistance = { $lte: ["$cityDistance", 20] }
            sort.mulca = 1
            sort['me.coin'] = -1
            sort.createdAt = 1
        } else if (config.nearAge) {
            sort.ageDistance = 1
            sort['me.coin'] = -1
            sort.createdAt = 1
        } else if (config.nearCity) {
            sort.cityDistance = 1
            sort['me.coin'] = -1
            sort.createdAt = 1
        } else {
            sort['you.sex'] = 1
            sortConds = {
                $addFields: {
                    bothCond: { $cond: { if: { $and: ['$nearAge', '$nearCity', { $lte: ["$ageDistance", 3] }, { $lte: ["$cityDistance", 20] }] }, then: '$mulca', else: 'a' } },
                    nearAgeCond: {
                        $cond: {
                            if: { $and: ['$nearAge', { $lte: ["$ageDistance", 3] }] }
                            , then: '$ageDistance',
                            else: 'a'
                        }
                    },
                    nearCityCond: {
                        $cond: {
                            if: { $and: ['$nearCity', { $lte: ["$cityDistance", 20] }] }
                            , then: '$cityDistance',
                            else: 'a'
                        }
                    },
                }
            }
            sort.bothCond = 1
            sort.nearAgeCond = 1
            sort.nearCityCond = 1
            sort['me.coin'] = 1
            sort.createdAt = 1

        }

        const search = await searchModel.aggregate([
            ...distanceAggregate,
            { $match: match },
            sortConds,
            { $sort: sort }
        ])

        if (!search.length) {
            const newSearch = await searchModel.create({
                me: user,
                you: config
            })
            setTimeout(async () => {
                const prevSearch = await searchModel.findByIdAndDelete(newSearch._id);
                if (prevSearch) {
                    const newSocketUser = await userModel.findById(prevSearch.me._id)
                    io.to(newSocketUser.socketId).emit('notfound')
                    redisClient.publish('notFound', String(newSocketUser.uid)) 
                }
            }, 120000);
        } else {

            const newConnection = await connectionModel.create({
                creatorUser: search[0].me,
                joinedUser: user
            })

            let joinedcost = 0
            if (config.sex != 'random') joinedcost += 2
            if (config.nearAge) joinedcost++
            if (config.nearCity) joinedcost++

            let creatorcost = 0
            if (search[0].you.sex != 'random') creatorcost += 2
            if (search[0].you.nearAge) creatorcost++
            if (search[0].you.nearCity) creatorcost++

            await userModel.findByIdAndUpdate(user._id, { $inc: { coin: -joinedcost } })
            await userModel.findByIdAndUpdate(search[0].me._id, { $inc: { coin: -creatorcost } })

            io.to(search[0].me.socketId).emit('coin', search[0].me.coin - creatorcost)
            io.to(user.socketId).emit('coin', user.coin - joinedcost)

            await searchModel.findByIdAndDelete(search[0]._id)

redisClient.publish('connection', JSON.stringify({
    creatorUser: search[0].me,
    joinedUser: user
}), (err, count) => {
  if (err) {
    console.error('Error publishing message:', err);
    return;
  }
  console.log(`Message published to ${count} subscribers`);
});
            io.to(search[0].me.socketId).emit('find',
                {
                    nickName: user.nickName,
                    age: user.age,
                    sex: user.sex,
                    state: user.state.name,
                    city: user.city.name,
                    profileRef: user.profileRef
                })
            io.to(user.socketId).emit('find',
                {
                    nickName: search[0].me.nickName,
                    age: search[0].me.age,
                    sex: search[0].me.sex,
                    state: search[0].me.state?.name,
                    city: search[0].me.city?.name,
                    profileRef: search[0].me.profileRef
                })
        }

    }
    const stopMessaging = async arg => {
        const closed = await connectionModel.findOneAndUpdate({ $or: [{ joinedUser: arg }, { creatorUser: arg }], closed: false }, { $set: { closed: true, finished_at: new Date() } }).populate('joinedUser creatorUser')
        if (closed) {
            io.to(closed.joinedUser.socketId).emit('closed')
            io.to(closed.creatorUser.socketId).emit('closed')
            redisClient.publish('disConnection', JSON.stringify(closed))
        }
    }
    const sendInviteLinkHandler = async arg => {
        const user = await userModel.findById(arg)
        redisClient.publish('sendInvite', JSON.stringify(user))
    }
    socket.on('search', searchForSomeone)
    socket.on('stop', stopMessaging)
    socket.on('getInviteLink', sendInviteLinkHandler)
}