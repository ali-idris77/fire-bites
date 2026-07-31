const axios = require('axios')

const sendWhatsapp = async (phone, body)=>{
    console.log(process.env.WHATSAPP_TOKEN.slice(0, 10))
    try{
        const response =await axios.post(`https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: {
            body: body
        }
    },{
        headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json"
        }
    })
    console.log(response.data)
    console.log(`WhatsApp message sent to ${phone}: ${body}`)
    }catch(err){
        console.log(err.response?.data || err.message)
        throw new Error("Failed to send WhatsApp message")
    }
}

module.exports = sendWhatsapp;