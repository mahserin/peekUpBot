const mongoose = require('mongoose');


const schema = mongoose.Schema({
    nearAge : {
        type : Boolean,
        default : false
    } ,
    nearCity :{
        type : Boolean ,
        default: false
    },
    sex: {
        type : String ,
        default : 'random'
    },
},{
    timestamps: true
})
 const model = mongoose.model('configs' , schema)

 module.exports = model