const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: true
    },
    items:[
{ 
    dish:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'dish',
        required:true
    },
   
    quantity:{
        type:Number,
        required:true,
        default: 1
    }
}]
},{timestamps:true})

const Cart = mongoose.model('cart', cartSchema)

module.exports = Cart;