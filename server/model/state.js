const mongoose = require('mongoose');


const schema = mongoose.Schema({
    engName : String ,
    name : String
},{
    timestamp: true
})
 const model = mongoose.model('states' , schema)

 module.exports = model