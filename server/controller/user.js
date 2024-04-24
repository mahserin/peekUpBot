
const userModel = require('./../model/user');
const configModel = require('./../model/config');

const fs = require('fs');

exports.getOne = async (req , res) => {
const user = await userModel.findById(req.params.id).populate('config')
res.status(200).json(user)
}

exports.update = async (req , res) => {
    const user = await userModel.findByIdAndUpdate(req.params.id ,{$set : {...req.body}} )
    const updatedUser = await userModel.findById(req.params.id)
    if(updatedUser.nickName && updatedUser.age && updatedUser.sex && updatedUser.firstTime) {
        const editedUser = await userModel.findByIdAndUpdate(req.params.id ,{$set : {firstTime : false} , $inc : { coin : 15}} )
        req.app.get('io').to(updatedUser.socketId).emit('coin' , editedUser.coin + 15)
        
    }
    res.status(200).json({message : 'updated' , user})
}

exports.setProfile = async (req , res) => {
    const user = await userModel.findByIdAndUpdate(req.params.id ,{$set : {profileRef : req.file.destination.split('.')[1] +'/' + req.file.filename}} )
     try{

        await fs.unlink('./' + user.profileRef , err => {
            if(err) console.log(err)
        } )
    }catch (err) {
        console.log(err)
    }
     const newuser = await userModel.findById(req.params.id)
    
    res.status(200).json({message:'image uploaded' ,user : newuser})

}

exports.deleteProfile = async (req, res) => {
    console.log('req')
    const user = await userModel.findByIdAndUpdate(req.params.id , {$unset : {profileRef : ''}})
    try{

        await fs.unlink('./' + user.profileRef , err => {
            if(err) console.log(err)
        } )
    }catch (err) {
        console.log(err)
    }
const newuser = await userModel.findById(req.params.id)
    res.status(201).json({message : 'profile deleted successfully' , user : newuser})
}