const mongoose = require('mongoose');


const schema = mongoose.Schema({
    engName : String ,
    name : String ,
    state : {
        type : mongoose.Types.ObjectId,
        ref : 'states'
    }
},{
    timestamp: true
})
 const model = mongoose.model('cities' , schema)

 module.exports = model