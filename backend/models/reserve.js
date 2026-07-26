const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
    customerName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    guests:{
        type:Number,
        required:true,
        min:1,
        default:1
    },
    reservationDate:{
        type:Date,
        required:true
    },
    specialRequest:String,
    status:{
        type:String,
        enum:['pending','confirmed', 'completed', 'cancelled', 'rejected', 'no-show'],
        required:true,
        default:'pending'
    },
}, {timestamps:true});

const Reservation  = mongoose.model('reservation', reservationSchema);

module.exports = Reservation;