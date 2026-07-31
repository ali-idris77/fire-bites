const mongoose = require('mongoose')
const {  isEmail, isStrongPassword } = require('validator')
const bcrypt = require('bcrypt')
//declaring schema
const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:String,
    level:{
      type:Number,
      enum: [ 1, 2, 3, 4, 5 ], //['owner', 'manager', 'senior-staff', 'junior-staff', 'intern'] in reverse i.e owner 5, intern 1
      required:true,
      min:1,
      max:5,
      default:1
    },
    isSuspended:{
        type:Boolean,
        default:false
    },
    passwordResetRequired:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

//creating static method
//signup
userSchema.statics.signup = async function (email, password,fullname,level=1, phone, passwordResetRequired=false) {
    //validation
    //empty fields check
    if(!email || !password ||!fullname){
        throw Error('Please fill out all the required fields')
    }
    if(!isEmail(email)){
        throw Error('That email is not valid')
    }
   
    //existing email check
    const exists = await this.findOne({email})
    if(exists){
        throw Error('Email is already in use')
    }
     //strong password check
    if(!isStrongPassword(password)){
        throw Error(`Password must be atleast 8 letters containing uppercase, lowercase, a digit and special character`)
    }
    
    //hashing password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const usr = {
        email, password:hash, fullname, level, passwordResetRequired
    }
    if(phone) usr.phone = phone
    const user = await this.create(usr)
    return user
}
//login
userSchema.statics.login = async function (email, password) {
    //validation
    //empty fields check
    if(!email || !password){
        throw Error('Please fill out all the fields')
    }
    //existing email check
    const user = await this.findOne({email})
    if(!user){
        throw Error('Incorrect email')
    }
    //comparing password
    const isRight = await bcrypt.compare(password, user.password)
    if(!isRight){
        throw Error('Incorrect password')
    }
    return user
}

    const User = mongoose.model('user', userSchema)

    module.exports = User
