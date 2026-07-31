const crypto = require('crypto');
const Order = require('../models/order');
const User = require('../models/customer');
const Cart = require('../models/cart');
const Notification = require('../models/notification')
const {getIo} = require('../sockets/socket');
const sendEmail = require('../services/email/sendEmail')
const orderReceipt = require('../services/email/templates/orderReceipt')

const paymentWebhook = async (req, res)=>{
    ('webhook reached')
    const hash = crypto.createHmac(
        'sha512',
        process.env.PAYSTACK_SECRET_KEY
    ).update(req.body).digest('hex')

    const signature = req.headers['x-paystack-signature'];

    if(hash !== signature){
        return res.sendStatus(401)
    }
    const event = JSON.parse(req.body.toString())
    if(event.event === 'charge.success'){
        const reference = event.data.reference
        const order = await Order.findOne({"payment.reference":reference})

        if(!order){
            return res.sendStatus(404)
        }

        order.payment.status = 'paid'
        order.status = 'preparing'
        order.payment.paidAt = new Date()
        await order.save()

        await Cart.findOneAndUpdate({customer: order.customer} , {$set: {items: []}})
        
        const io = getIo()
        const notification = await Notification.create({title:'Order Payment', type:'order', message:'Order has been made and paid for', meantFor:"admin", reason:order._id})
        io.to("admin").emit("notification", notification)
        io.to("mgt").emit("notification", notification)
        sendEmail({
            to: order.customerEmail,
            subject: 'Order Payment',
            html: orderReceipt(order)
        })
    }
    res.sendStatus(200)
}
module.exports = paymentWebhook