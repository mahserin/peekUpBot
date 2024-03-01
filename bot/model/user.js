const mongoose = require('mongoose');

const schema  =  mongoose.Schema({
    uid : Number ,
    username : String ,
    Fname : String ,
    Lname : String,
    nickName : String, 
    profileRef : String,
    age : Number ,
    role : {
        type : String,
        enum : ['ADMIN', 'USER' , 'OWNER']
    },
    state : {
        type : mongoose.Types.ObjectId,
        ref : 'states'
    },
    city : {
        type : mongoose.Types.ObjectId,
        ref : 'cities'
    },
    sex : {
        type : String 
    },
    coin : {
        type : Number,
        default : 0
    },
    last_message_time  : Date
}, {timestamp : true})

const model = mongoose.model('users' , schema)

module.exports = model