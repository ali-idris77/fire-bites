const axios = require('axios')
const crypto = require('crypto')
const {getIo} = require('../sockets/socket')
const dotenv = require('dotenv')
dotenv.config()

const Order = require('../models/order')
const User = require('../models/customer')

const checkout = async(req, res)=>{
    const {customer, customerEmail, customerPhone, items, amount} = req.body;
    const io = getIo()
    try{
        const orderAmount = Number(amount || 0)
        const reference = crypto.randomUUID()

        const normalizedItems = (items || []).map(item => ({
            dish: item.dishId || item.dish,
            quantity: Number(item.quantity || 1)
        }))

        const order = await Order.create({
            customer: customer || undefined, 
            customerEmail,
            customerPhone,
            items: normalizedItems,
            amount: orderAmount,
            payment:{
                reference
            }
        })
        io.to("admin").emit("order-create", order)
        io.to("admin").emit("analytics-update", order)
        io.to("mgt").emit("order-create", order)
        io.to("mgt").emit("analytics-update", order)
        

        const response = await axios.post('https://api.paystack.co/transaction/initialize',{
            email: customerEmail || process.env.PAYSTACK_RECEIVER_EMAIL || 'hello@fireybites.com',
            amount: Math.round(orderAmount * 100),
            metadata:{
                orderId: order._id.toString()
            },
            reference,
            callback_url: `${process.env.APP_URL}/payment/callback`
        },
        {
            headers:{
                Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type':'application/json'
            }
        }
        )

        res.json({
            authorization_url: response.data.data.authorization_url
        })
    }catch(err){
        console.log(err.response?.data || err)
        res.status(500).json({
            message:'payment initialization failed'
        })
    }
}
module.exports = checkout;