const Order = require('../models/order')
const {getIo} = require('../sockets/socket')
const sendEmail = require('../services/email/sendEmail')
const orderStatus = require('../services/email/templates/orderStatus')

const create = async (req, res)=>{
    const {items, customer, customerEmail, customerPhone, amount} = req.body;
    const io =getIo()
    try{
        const order = await Order.create({dish, customer, customerEmail, customerPhone, amount})
        io.to("admin").emit("order-create", order)
        io.to("admin").emit("analytics-update", order)
        res.status(200).json(order)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}
const get = async (req, res)=>{
    try{
        const orders = await Order.find({}).populate('items.dish').sort({createdAt:-1})
        res.status(200).json(orders)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}
const get_p = async (req, res)=>{
    const customerEmail = req.user.email
    try{
        const orders = await Order.find({customerEmail}).populate('items.dish').sort({createdAt:-1})
        res.status(200).json(orders)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}
const getOne = async (req, res)=>{
    const id = req.params.id
    try{
        const orders = await Order.find({id}).populate('items.dish').sort({createdAt:-1})
        res.status(200).json(orders)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}
const update = async (req, res)=>{
    const io = getIo()
    const update = req.body;
    const id = req.params.id
    try{
        const updated = await Order.findByIdAndUpdate(id, {$set:update}, {returnDocument: 'after'})
        io.to(updated.customerEmail).emit("order-update", updated)
        io.to("admin").emit("analytics-update", updated)
        sendEmail({
            to: updated.customerEmail,
            subject: 'Order Update',
            html: orderStatus(updated)
        })
        res.status(200).json(updated)
    }catch(err){
        res.status(500).json(err)
    }
}
const deleteOne = async (req, res)=>{
    const id = req.params.id;
    try{
        const deleted = await Order.findByIdAndDelete(id)
        res.status(200).json(deleted)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    create, get, get_p, update ,deleteOne
}