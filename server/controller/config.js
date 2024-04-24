
const userModel = require('./../model/user');
const configModel = require('./../model/config');

exports.setConfig = async (req , res ) => {
    const  user = await userModel.findById(req.params.id)
    
    await configModel.findByIdAndUpdate(user.config , {$set : {...req.body}})
    const newConfig = await configModel.findById(user.config)
    let cost = 0 
    if (newConfig.sex == 'male' ||newConfig.sex == 'female') cost += 2
    if (newConfig.nearAge) cost++
    if (newConfig.nearCity) cost++
    res.status(200).json({message : 'set' , cost , newConfig})
    

}