const axios = require('axios')
const crypto = require('crypto')
const dotenv = require('dotenv')
dotenv.config()

const Order = require('../models/order')
const User = require('../models/customer')

const checkout = async(req, res)=>{
    const {customer, customerEmail, customerPhone, items, amount} = req.body;
    console.log(body)
    try{
        
      
        const amount = body.total
        const transactionType = body.orderType
        const reference = crypto.randomUUID()
        const users = await User.findById(customer)
        console.log(users)
        const order = await Order.create({
            customer,
            customerEmail,
            customerPhone,
            items,
            amount,
            payment:{
                reference
            }
        })
        //payment response
        const response = await axios.post('https://api.paystack.co/transaction/initialize',{
        email : users.email,
        amount : amount * 100,
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
);
console.log('paystack response: ', response.data.data)
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