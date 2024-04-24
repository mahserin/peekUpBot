const mongoose = require('mongoose');


const schema = mongoose.Schema({
    me: Object ,
    you :Object ,
    token : String
},{
    timestamps: true
})
 const model = mongoose.model('search' , schema)

 module.exports = model