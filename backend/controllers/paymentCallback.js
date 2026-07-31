const axios = require("axios");

async function paymentCallback(req, res) {
    console.log('callback request body: ', req.query)
    const { reference } = req.query;
    const verification = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`,
        {
        headers:{
            Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
    }
    );
    if(verification.data.data.status === "success"){
        const orderId = verification.data.data.metadata.orderId
        return res.redirect(`${process.env.FRONTEND_URL}/bag?tab=order`);
    }
    res.redirect(`${process.env.FRONTEND_URL}/payment-failed`)
}

module.exports = paymentCallback;