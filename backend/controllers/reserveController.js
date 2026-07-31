const Reservation = require("../models/reserve");
const {getIo} = require('../sockets/socket')
const sendEmail = require('../services/email/sendEmail')
const reservationTemplate = require('../services/email/templates/reservationTemplate')
const sendWhatsapp = require('../services/whatsapp/sendWhatsapp')

//controllers

//get all reservations
const all_reservations = async(req, res) =>{
    try{
        const reservations = await Reservation.find().sort({createdAt:-1});
        res.status(200).json(reservations);
    }catch(error){
        res.status(500).json({err:"Couldn't fetch reservations. Try again later.", error:error.message});
    }
};
//get all reservations
const pers_reservations = async(req, res) =>{
    const user = req.params.email;
    try{
        const reservations = await Reservation.find({email: user}).sort({createdAt:-1});
        
        res.status(200).json(reservations);
    }catch(error){
        res.status(500).json({err:"Couldn't fetch reservations. Try again later.", error:error.message});
    }
};
//get single reservation
const one_reservation = async(req, res) =>{
    const id = req.params.id;
    try{
        const reservations = await Reservation.findById(id);
        res.status(200).json(reservations);
    }catch(error){
        res.status(500).json({err:"Couldn't fetch Reservation. Try again later.", error:error.message});
    }
};
//post/ create Reservation
const test_create = async(req,res)=>{
    try{
        const reservation = await Reservation.create(req.body)
        res.status(200).json(reservation)
    }catch(err){
        res.json(err)
    }
}
const post_reservation = async(req, res)=>{
    const io = getIo()
    const {customerName, phone, email, guests, reservationDate, specialRequest } = req.body;
    
    let error
    if(!customerName || !phone || !email || !guests || !reservationDate){
        error = {message:"The name, email, guests and date/time fields are required and must be filled"}
    }
    const dbody ={customerName, phone, email, guests, reservationDate }
    if (specialRequest) dbody.specialRequest = specialRequest


    try{
        const reservation = await Reservation.create(dbody)
        io.to("admin").emit("reserve-create", reservation)
        io.to("admin").emit("analytics-update", reservation)
        io.to("mgt").emit("order-create", order)
        io.to("mgt").emit("analytics-update", order)
        res.status(200).json(reservation)
    }catch(errs){
        console.log(errs.message)
        res.status(400).json({err:"Unable to create Reservation. Try again later.", error:error.message});
    }
}

//patch/ update Reservation
const patch_reservation = async(req, res)=>{
    const io = getIo()
    const update = req.body
    const id = req.params.id
    try{
        const reservation = await Reservation.findByIdAndUpdate(id, {$set:update}, {returnDocument: 'after'})
        io.to(reservation.email).emit("reserve-update", reservation)
        io.to("admin").emit("analytics-update", reservation)
        io.to("mgt").emit("analytics-update", reservation)
        sendEmail({
            to: reservation.email,
            subject: 'Reservation Update',
            html: reservationTemplate(reservation)
        })
         res.status(200).json(reservation)
    }catch(error){
        res.status(400).json({error:error.message, err:"Coldn't update Reservation"})
    }
}
//delete Reservation

const delete_reservation = async(req, res)=>{
    const id = req.params.id
    try{
        const deleted = await Reservation.findByIdAndDelete(id)
        res.status(200).json(deleted)
    }catch(error){
        res.status(500).json({error:error.message, err:"Couldn't delete Reservation"})
    }
}

module.exports= {
    all_reservations, patch_reservation, delete_reservation, one_reservation, post_reservation, pers_reservations, test_create

}