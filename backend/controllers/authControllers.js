const User = require("../models/user");
const Customer = require('../models/customer')
const jwt = require('jsonwebtoken');
const {getIo} = require('../sockets/socket')
//jwt creation
const createToken = (id)=>{
    const token = jwt.sign({id}, process.env.SECRET, {expiresIn:'5d'});
    return token;
};
    
//signup logic
const signup = async (req, res)=>{
    const io = getIo()
    console.log(req.body)
    const {email, password,fullname,level,phone} = req.body;
    try{
        const user = await User.signup(email, password,fullname,level,phone);
        const token = createToken( user.id);
        io.to("admin").emit("analytics-update", user)
        io.to("admin").emit("new-user", user)
        res.status(200).json({user: user.email, isStaff:true, level: user.level, token});
    }catch(err){
        res.status(400).json({error: err.message});
    };
};
//login logic
const login = async (req, res)=>{
    const {email, password} = req.body;
    try{
        const user = await User.login(email, password);
        const token = createToken( user.id);
        res.status(200).json({user: user.email, isStaff:true, level: user.level, token});
    }catch(err){
        res.status(400).json({error: err.message});
    };
}
const customr_signup = async (req, res)=>{
    const {email, phone, password} = req.body;
    try{
        const user = await Customer.signup(email, phone, password);
        const token = createToken( user.id);
        res.status(200).json({user: user.phone, email: user.email, token});
    }catch(err){
        console.log(err)
        res.status(400).json({error: err.message});
    };
};
//login logic
const customr_login = async (req, res)=>{
    const {email, phone, password} = req.body;
    try{
        const user = await Customer.login(email, password);
        const token = createToken( user.id);
        res.status(200).json({user: user.phone, email: user.email, token});
    }catch(err){
        res.status(400).json({error: err.message});
    };
}

module.exports= {signup, login, customr_signup, customr_login};