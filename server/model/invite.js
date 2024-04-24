const mongoose = require('mongoose');


const schema = mongoose.Schema({
    caller : {
        type : mongoose.Types.ObjectId,
        ref : 'users'
    },acceptor : {
        type : mongoose.Types.ObjectId
    },
    
},{
    timestamps: true
})
 const model = mongoose.model('invites' , schema)

 module.exports = model