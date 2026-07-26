const mongoose = require('mongoose')
const {  isEmail, isStrongPassword, isMobilePhone } = require('validator')
const bcrypt = require('bcrypt')
//declaring schema
const customerSchema = mongoose.Schema({
    email:{
        type:String,
        unique:true
    },
    phone:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    address:[String]
},{timestamps:true})

//creating static method
//signup
customerSchema.statics.signup = async function (email, phone, password) {
    //validation
    //empty fields check
    if(!phone || !password){
        throw Error('Please fill out all the fields')
    }
    if(!isMobilePhone(phone)){
        throw Error('That phone number is not valid')
    }
   
    //existing email check
    const existsE = await this.findOne({email})
    if(email && existsE){
        throw Error('Email is already in use')
    }
    const existsPhone = await this.findOne({phone})
    if(existsPhone){
        throw Error('Phone number is already in use')
    }
     //strong password check
    if(!isStrongPassword(password)){
        throw Error(`Password must be atleast 8 letters containing uppercase, lowercase, a digit and special character`)
    }
    
    //hashing password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const customer = await this.create({email, phone, password:hash})
    return customer
}
//login
customerSchema.statics.login = async function (email, password) {
    //validation
    //empty fields check
    if(!email || !password){
        throw Error('Please fill out all the fields')
    }
    //existing email check
    const customer = await this.findOne({email})
    if(!customer){
        throw Error('Incorrect email or phone number')
    }
    //comparing password
    const isRight = await bcrypt.compare(password, customer.password)
    if(!isRight){
        throw Error('Incorrect password')
    }
    return customer
}

    const Customer = mongoose.model('customer', customerSchema)

    module.exports = Customer
