const {OAuth2Client} = require('google-auth-library')
const User = require("../models/user");
const Customer = require('../models/customer')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const {getIo} = require('../sockets/socket')
//jwt creation

const createToken = (id)=>{
    const token = jwt.sign({id}, process.env.SECRET, {expiresIn:'5d'});
    return token;
};
    
//signup logic
const signup = async (req, res)=>{
    const io = getIo()
    const {email, password,fullname,level,phone} = req.body;
    try{
        const user = await User.signup(email, password,fullname,level,phone);
        const token = createToken( user.id);
        io.to("admin").emit("analytics-update", user)
        io.to("admin").emit("new-user", user)
        io.to("mgt").emit("analytics-update", user)
        io.to("mgt").emit("new-user", user)
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
        res.status(200).json({
            user: user.email,
            isStaff:true,
            level: user.level,
            token,
            passwordResetRequired: user.passwordResetRequired
        });
    }catch(err){
        res.status(400).json({error: err.message});
    };
}

const changePassword = async (req, res) => {
    const { email, current, newPass } = req.body
    try {
        if (!email || !current || !newPass) {
            throw new Error('Current and new password are required')
        }
        if (newPass.length < 8) {
            throw new Error('Password must be at least 8 characters')
        }
        const user = await User.findOne({ email })
        if (!user) {
            throw new Error('User not found')
        }
        const match = await bcrypt.compare(current, user.password)
        if (!match) {
            throw new Error('Current password is incorrect')
        }
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPass, salt)
        user.passwordResetRequired = false
        await user.save()
        res.status(200).json({ message: 'Password updated successfully' })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}
const customr_signup = async (req, res)=>{
    const {email, phone, password} = req.body;
    try{
        const user = await Customer.signup(email, phone, password);
        const token = createToken( user.id);
        res.status(200).json({id:user.id, user: user.phone, email: user.email, token});
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
        res.status(200).json({id:user.id, user: user.phone, email: user.email, token});
    }catch(err){
        res.status(400).json({error: err.message});
    };
}

//google auth
const google_auth = async (req, res)=>{
const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID)
        try{
        const ticket = await client.verifyIdToken({
        idToken: req.body.token,
        audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload()
        let user = await Customer.findOne({
            email: payload.email
        })
        if(!user){
            user = await Customer.create({
                email: payload.email,
                googleId: payload.sub,
                provider: "google"

            })
        }
        if(!user.googleId){
            user.googleId = payload.sub
            user.provider = "google"
        }
        const token = createToken( user.id);
        res.status(200).json({id:user.id, user: user.phone, email: user.email, token});
    }catch(err){
        console.log(err)
        res.status(400).json({error: err.message});
    }
}


module.exports= {signup, login, customr_signup, changePassword, google_auth, customr_login};