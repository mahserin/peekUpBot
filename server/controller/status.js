const model = require('../model/connection');
const searchModel = require('../model/search');
const { mongoose } = require("mongoose");
exports.getOne = async (req , res) => {
const connection = await model.findOne({ closed : false ,$or : [{joinedUser : req.params.id} , {creatorUser : req.params.id}]}).populate('joinedUser creatorUser')
if(connection){

    if(req.params.id == connection.creatorUser._id) {
        return res.status(200).json({connectedTo : {
            nickName: connection.joinedUser.nickName,
            age:  connection.joinedUser.age,
            sex:  connection.joinedUser.sex,
            state:  connection.joinedUser.state.name,
            city:  connection.joinedUser.city.name,
            profileRef:  connection.joinedUser.profileRef,
        } , message: 'find'})
    }else if(req.params.id == connection.joinedUser._id){
        return res.status(200).json({connectedTo : {
            nickName: connection.creatorUser.nickName,
            age:  connection.creatorUser.age,
            sex:  connection.creatorUser.sex,
            state:  connection.creatorUser.state.name,
            city:  connection.creatorUser.city.name,
            profileRef:  connection.creatorUser.profileRef,
        } , message: 'find'})}
}
const search = await searchModel.findOne({'me._id' : new mongoose.Types.ObjectId(req.params.id)})
if(search){
    return res.status(200).json({message : 'search'})
}
res.status(200).json(null)
}