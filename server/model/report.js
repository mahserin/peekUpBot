const mongoose = require('mongoose');


const schema = mongoose.Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref : 'users'
    },
    message : {
        type : mongoose.Types.ObjectId,
        ref : 'messages'
    },
    status : String
},{
    timestamp: true
})
 const model = mongoose.model('reports' , schema)

 module.exports = model