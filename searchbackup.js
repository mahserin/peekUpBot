const searchForSomeone = async arg => {
    const user = await userModel.findById(arg).populate('config')
    const config = { nearAge: user.config.nearAge, nearCity: user.config.nearCity, sex: user.config.sex }
    let userCost = 0 
    if (config.sex != 'random') {
        userCost += 2
    } 
    userCost += Number(config.nearCity)
    userCost += Number(config.nearAge)

    if(userCost > user.coin) return io.to(user.socketId).emit('coin:scant')

    const meInSearch = await searchModel.findOne({ 'me._id': user._id })
    if (meInSearch) return console.log('me in search')
    
    io.to(user.socketId).emit('searching')

    let match = {}
    if (config.sex == 'male' || config.sex == 'female') match = { "me.sex": config.sex }
    match['$or'] = [{'you.sex' : 'random'} , {'you.sex' : user.sex}]
    
    
    const distanceAggregate = [{$addFields : {
        cityDistance: {$sqrt: [{$sum: [{$pow: [{$subtract: [{$toDouble:"$me.city.latitude"},+user.city.latitude]},2]},{$pow: [{$subtract: [{$toDouble:"$me.city.longitude"},+user.city.longitude]},2]}]}]},
        ageDistance: {$abs : {$subtract : ['$me.age' , user.age]}}

    }},{$addFields : {mulca : {$multiply : ['$ageDistance' , '$cityDistance']}}}]
    
    const sort = {}
    if(config.nearAge && config.nearCity){
        match.ageDistance = {$lte : 3}
        match.cityDistance = {$lte : 20}
        sort.mulca = 1
    }else if(config.nearAge) {
        sort.ageDistance = 1
    }else if(config.nearCity) {
        sort.cityDistance = 1
    }else{

    }
    sort['me.coin'] = 1
    sort.createdAt = 1

    const search = await searchModel.aggregate([
        distanceAggregate,
        { $match: match },
        {$sort : sort}
    ])

    if (!search.length) {
        console.log('created')
        const newSearch = await searchModel.create({
            me: user,
            you: config
        })
        setTimeout(async () => {
            const prevSearch = await searchModel.findByIdAndDelete(newSearch._id);
            if (prevSearch) {
                const newSocketUser = await userModel.findById(prevSearch.me._id)
                io.to(newSocketUser.socketId).emit('notfound')}
        }, 12000);
    } else {
        console.log('joined')

        const newConnection = await connectionModel.create({
            creatorUser: search[0].me,
            joinedUser: user
        })

        let joinedcost = 0
        if(config.sex != 'random') joinedcost += 2
        if(config.nearAge) joinedcost++
        if(config.nearCity) joinedcost++
        
        let creatorcost = 0
        if(search[0].you.sex != 'random') creatorcost += 2
        if(search[0].you.nearAge) creatorcost++
        if(search[0].you.nearCity) creatorcost++
        console.log(creatorcost)

        await userModel.findByIdAndUpdate(user._id , {$inc :  { coin : -joinedcost}})
        await userModel.findByIdAndUpdate(search[0].me._id , {$inc :  { coin : -creatorcost}})

        io.to(search[0].me.socketId).emit('coin' , search[0].me.coin - creatorcost)
        io.to(user.socketId).emit('coin' , user.coin - joinedcost)
        