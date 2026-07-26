const Cart = require('../models/cart')
const dish = require('../models/dish')

module.exports.cart_create = async (req, res)=>{
    const customer =req.user.id
    const {dishId, quantity} = req.body
    console.log(req.body)
    try{
        //validate dish exists
        const prod = await dish.findById(dishId)
        if(!prod) return res.status(404).json({msg: "dish not found"})
        //find user's cart 
        let cart = await Cart.findOne({customer})
        console.log('cart',cart)
        if(!cart){
            //if no cart create one
            cart = new Cart({
                customer,
                items:[]
            })
        }
        const itemIndex = cart.items.findIndex(item => item.dish.toString() === dishId)                      
        if(itemIndex > -1){
            cart.items[itemIndex].quantity += quantity
        }else{
            cart.items.push({
                dish: dishId,
                quantity})
        }
        await cart.save()
        const crt = await Cart.findById(cart._id).populate('items.dish')
        res.json(crt)
    }catch(err){
        res.json({err})
    }
}

module.exports.get_carts = async (req, res)=>{
    const customer = req.user._id

    try{
        let carts = await Cart.find({customer}).populate('items.dish')
        res.json(carts)
    }catch(err){
        res.json(err)
    }
}
module.exports.update_Cart = async (req, res)=>{
    const customer = req.user._id
    const {dishId, quantity} = req.body
    
    try{
        const cart = await Cart.findOne({customer})
        if(!cart) return res.status(404).json({msg: "Cart not found"})
            const index = cart.items.findIndex(item => item.dish.toString() === dishId )
            if(index === -1){
                return res.status(404).json({msg: "Item not found in cart"})
            }else if(quantity === 0){
                cart.items.splice(index, 1)
            }else{
                cart.items[index].quantity = quantity
               
            }
        await cart.save()
        
        const crt = await Cart.findById(cart._id).populate('items.dish')
        res.json(crt)
    }catch(err){
        res.json({err})
    }
}
module.exports.delete_Cart = async (req, res)=>{
    const customer = req.user._id
    const {dishId} = req.body
    console.log(req.body)
    try{
        const cart = await Cart.findOne({customer})
        if(!cart) return res.status(404).json({msg: "Cart not found"})
            cart.items = cart.items.filter(item => !(item.dish.toString() === dishId ))
        await cart.save()
        res.json(cart)
    }catch(err){
        res.json({err})
    }
}
module.exports.clear_cart = async(req, res)=>{
    console.log('clearing...')
    const customer = req.user._id
    try{
        const clear = await Cart.findOneAndUpdate({customer} , {$set: {items: []}})
        console.log('done', clear)
        res.json(clear)
    }catch(err){
        res.json({err})
    }
}