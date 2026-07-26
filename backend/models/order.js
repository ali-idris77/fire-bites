const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'customer'
    },
    //if customer not present,
    customerEmail:String,
    customerPhone:String,
    items:[{
        dish:{type: mongoose.Schema.Types.ObjectId,
            ref:'dish',
            required:true
        },
        quantity:{
            type:Number,
            default:1
        }
        }],
        amount:{
            type:Number,
            required:true
        },
        status:{
            type:String,
            enum:['pending', 'preparing', 'finished', 'completed', 'cancelled'],
            default:'pending'
        },
        payment:{
            status:{
                type:String,
                enum:['pending', 'paid', 'failed'],
                default:'pending'
            },
            method:String,
            reference:String,
            paidAt:Date
        }
},{timestamps:true})

const Order = mongoose.model('order', orderSchema)

module.exports= Order;