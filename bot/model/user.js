const mongoose = require('mongoose');

const schema  =  mongoose.Schema({
    uid : Number ,
    username : String ,
    Fname : String ,
    Lname : String,
    nickName : String, 
    profileRef : String,
    age : Number ,
    config : {
        type : mongoose.Types.ObjectId ,
        ref : 'configs'
    },
    role : {
        type : String,
        enum : ['ADMIN', 'USER' , 'OWNER']
    },
    state : Object,
    city : Object,
    sex : {
        type : String 
    },
    coin : {
        type : Number,
        default : 5
    },
    last_message_time  : Date,
    firstTime : {
        type : Boolean,
        default : true
    },
    socketId : String,
    token : Number
}, { timestamps: true })

const model = mongoose.model('users' , schema)

module.exports = model