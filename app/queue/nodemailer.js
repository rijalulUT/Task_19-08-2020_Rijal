const nodemailer = require("nodemailer")
require('dotenv').config()
let send = async args =>{
    try{
        let transporter = nodemailer.createTransport(
            configMail = {
                service:'gmail',
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.PASSWORD_EMAIL
                }
            }
        )

        let info = await transporter.sendMail({
            from: process.env.USER_EMAIL,
            to: args.email,
            subject:args.subject,
            html:args.body
        })
        console.log("Message sent: %s", info.messageId)
        return nodemailer.getTestMessageUrl(info)
    }catch (err) {
        console.log(err)
    }
}

module.exports = {
    send
}
