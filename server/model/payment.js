const mongoose = require('mongoose');


const schema = mongoose.Schema({
user : {
    type : mongoose.Types.ObjectId ,
    ref : 'users'
},
traceCode : Number,
price : Number
},{
    timestamp: true
})
 const model = mongoose.model('payments' , schema)

 module.exports = model