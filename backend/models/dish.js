const mongoose = require('mongoose');

const dishSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    discountPrice:Number,
    discountPercentage:Number,
    tags:[String],
    category:{
        type:String,
        enum:['grills', 'desserts', 'snacks', 'continental', 'pasta', 'noodles','casserole', 'pastry', 'breakfasts', 'combo', 'full-combo', '3-course-meal', 'fast-foods', 'specials', 'drinks', 'sandwiches', 'sides', 'carbs', 'rice-dishes', 'soups', 'proteins','healthy'],
        required:true
    },
    image:{
        url:{
            type:String,
            required:true
        }
    },
    isActive:{
        type:Boolean,
        default:true
    },
}, {timestamps:true});

const Dish  = mongoose.model('dish', dishSchema);

module.exports = Dish;