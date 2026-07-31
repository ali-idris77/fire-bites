const Notification = require('../models/notification')
const {getIo} = require('../sockets/socket')

const create = async (req, res)=>{
    const io = getIo()
    const {title, type, message, meantFor, reserv, reason} = req.body;
    try{
        const notification = await Notification.create({title, type, message, meantFor, reason})
        io.to(meantFor).emit("notification", notification)
        res.status(200).json(notification)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}
const get = async (req, res)=>{
    try{
        const notifications = await Notification.find({}).sort({createdAt:-1})
        res.status(200).json(notifications)
    }catch(err){
        res.status(500).json(err)
    }
}
const p_get = async (req, res)=>{
    const meantFor = req.params.email
    try{
        const notifications = await Notification.find({meantFor}).populate('reason').populate('reserv').sort({createdAt:-1})
        res.status(200).json(notifications)
    }catch(err){
        res.status(500).json(err)
    }
}
const a_get = async (req, res)=>{
    try{
        const notifications = await Notification.find({meantFor:"admin"}).populate('reason').populate('reserv').sort({createdAt:-1})
        console.log(notifications)
        res.status(200).json(notifications)
    }catch(err){
        res.status(500).json(err)
    }
}
const m_get = async (req, res)=>{
    try{
        const notifications = await Notification.find({$or:[{meantFor:"mgt"}, {meantFor:"admin"}]}).populate('reason').populate('reserv').sort({createdAt:-1})
        console.log(notifications)
        res.status(200).json(notifications)
    }catch(err){
        res.status(500).json(err)
    }
}

const update = async (req, res)=>{
    const update = req.body;
    const id = req.params.id
    try{
        const updated = await Notification.findByIdAndUpdate(id, {$set:update}, {returnDocument: 'after'})
        res.status(200).json(updated)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}
const deleteOne = async (req, res)=>{
    const id = req.params.id;
    try{
        const deleted = await Notification.findByIdAndDelete(id)
        res.status(200).json(deleted)
    }catch(err){
        res.status(500).json(deleted)
    }
}
module.exports = {
    create, get ,p_get, a_get, m_get, update, deleteOne
}