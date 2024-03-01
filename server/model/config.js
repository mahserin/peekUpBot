const mongoose = require('mongoose');


const schema = mongoose.Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref : 'users'
    },
    age : Number ,
    city :{
        type : mongoose.Types.ObjectId,
        ref : 'cities'
    },
    sex: Number,
},{
    timestamp: true
})
 const model = mongoose.model('configs' , schema)

 module.exports = model