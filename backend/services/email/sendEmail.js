const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
})
transporter.verify((err, success) => {
    console.log(err || success);
});
const sendEmail = async ({to, subject, html})=>{
console.log('sending email')
console.log(process.env.SMTP_HOST);
console.log(process.env.SMTP_PORT);
console.log(process.env.SMTP_USER);
    try{
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html
    })}catch(err){
        console.error(err)
    }
}

module.exports = sendEmail;