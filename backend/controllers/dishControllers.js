const Dish = require("../models/dish");


//controllers

//get all dishes
const all_dishes = async(req, res) =>{
    try{
        const dishes = await Dish.find().sort({createdAt:-1});
        res.status(200).json(dishes);
    }catch(error){
        res.status(500).json({err:"Couldn't fetch dishes. Try again later.", error:error.message});
    }
};
//get all dishes
// const pers_dishes = async(req, res) =>{
//     const user_id = req.user.id;
//     try{
//         const dishes = await Dish.find({user_id}).sort({createdAt:-1});
//         res.status(200).json(dishes);
//     }catch(error){
//         res.status(500).json({err:"Couldn't fetch dishes. Try again later.", error:error.message});
//     }
// };
//get single Dish
const one_dish = async(req, res) =>{
    const id = req.params.id;
    try{
        const dishes = await Dish.findById(id);
        res.status(200).json(dishes);
    }catch(error){
        res.status(500).json({err:"Couldn't fetch Dish. Try again later.", error:error.message});
    }
};
//post/ create Dish
const test_create = async(req,res)=>{
    try{
        const dish = await Dish.create(req.body)
        res.status(200).json(dish)
    }catch(err){
        res.json(err)
    }
}
const post_dish = async(req, res)=>{
    const {name, price, discountPrice, discountPercentage, tag, category} = req.body;
    
    let error
    if(!name || !price || !category){
        error = {message:"The name, description, price, image and category fields are required and must be filled"}
    }
    if(!req.file){
        error = { message:'Please add an image'}
    }
    const image = {url:req.file.filename}
    console.log(image)
    const dbody ={name, price, category, image}
    if(discountPercentage) {
        dbody.discountPercentage = discountPercentage
        let dpr = ((100 - discountPercentage)/100) * price
        dbody.discountPrice = dpr
    }
    if (tag) dbody.tags = JSON.parse(tag)
    try{
        const dish = await Dish.create(dbody)
        res.status(200).json(dish)
    }catch(errs){
        console.log(errs.message)
        res.status(400).json({err:"Unable to create Dish. Try again later.", error:error.message});
    }
}

//patch/ update Dish
const patch_dish = async(req, res)=>{
    const {name, price, discountPrice, discountPercentage, tag, category} = req.body;
    
    let error
    if(!name || !price || !category){
        error = {message:"The name, description, price and category fields are required and must be filled"}
    }
    const dbody ={name, price, category}
    if(discountPercentage && discountPercentage !== 'undefined') {
        dbody.discountPercentage = discountPercentage
        let dpr = ((100 - discountPercentage)/100) * price
        dbody.discountPrice = dpr
    }
    if (tag) dbody.tags = JSON.parse(tag)

   
const id = req.params.id
    try{

        const dish = await Dish.findByIdAndUpdate(id, {$set:dbody}, {returnDocument: 'after'})
        res.status(200).json(dish)
    }catch(error){
        console.log(error)
        res.status(400).json({error:error.message, err:"Coldn't update Dish"})
    }
}
const upd_dish = async(req, res)=>{
    if(!req.file){
        throw new Error('File upload failed')
    }
    const id = req.params.id
    const image = req.file.filename
    try{
        const dish = await Dish.findByIdAndUpdate(id, {$set:{image}}, {returnDocument: 'after'})
        res.status(200).json(dish)
    }catch(error){
        res.status(400).json({error:error.message, err:"Coldn't update Dish"})
    }
}
//delete Dish

const delete_dish = async(req, res)=>{
    const id = req.params.id
    try{
        const deleted = await Dish.findByIdAndDelete(id)
        res.status(200).json(deleted)
    }catch(error){
        res.status(500).json({error:error.message, err:"Couldn't delete Dish"})
    }
}

module.exports= {
    all_dishes, patch_dish,upd_dish, delete_dish, one_dish, post_dish, test_create

}