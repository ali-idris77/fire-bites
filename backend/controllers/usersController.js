
const Customer = require('../models/customer')
/**@type {import ('mongoose').Model<any>} */
const User = require('../models/user')

module.exports.getUsers = async (req, res) =>{
    const customers = await Customer.find().select('-password').sort({createdAt:-1})
    const staffs = await User.find().select('-password').sort({createdAt:-1})

    res.status(200).json({customers, staffs})
    
}
module.exports.getProfile = async (req, res) =>{
    const id = req.admin._id
    const profile = await User.findOne({id}).select('-password')
    res.status(200).json(profile)
    
}
module.exports.updateStaff = async (req, res) =>{
    const id = req.params.id
    const update = req.body;
    try{
    if(update.email){
        const thersEmail = await User.findOne({email:update.email})
        if(id !== thersEmail.id){
            throw new Error('Email already taken')
        } 
    }
    const user = await User.findByIdAndUpdate(id, {$set:update}, {returnDocument:'after'})
    res.status(200).json(user)
    }catch(err){
        console.log(err)
        res.status(500).json({error:err.message})
    }
}
module.exports.deleteStaff = async (req, res) =>{
    const id = req.params.id
    try{
    const user = await User.findByIdAndDelete(id, {returnDocument:'after'})
    res.status(200).json(user)
    }catch(err){
        res.status(500).json({error:err.message})
    }
}
