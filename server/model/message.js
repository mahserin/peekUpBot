const mongoose = require('mongoose');


const schema = mongoose.Schema({
message_type : {
    type : String ,
},
media_ref: String ,
text : String ,
replied_at : Number ,
message_id : Number ,
connection : {
    type : mongoose.Types.ObjectId,
    ref : 'connections'
}
},{
    timestamps: true
})
 const model = mongoose.model('' , schema)

 module.exports = model