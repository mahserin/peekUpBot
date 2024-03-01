const mongoose = require('mongoose');


const schema = mongoose.Schema({
    creatorUser : {
        type : mongoose.Types.ObjectId ,
        ref : 'users'
    },
    joinedUser : {
        type : mongoose.Types.ObjectId ,
        ref : 'users'
    },
    finished_at : Date

},{
    timestamp: true
})
 const model = mongoose.model('connections' , schema)

 module.exports = model