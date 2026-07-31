const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:["order", "reserve", "announcement"],
        required:true
    },
    message:{
        type:String,
        required:true
    },
    meantFor:String,
    reason:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'order'
    },
    reserv:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'reservation'
    },
    isRead:{
        type:Boolean,
        default:false,
        required:true
    }
},{timestamps:true})

const Notification = mongoose.model('notification', notificationSchema);

module.exports = Notification;