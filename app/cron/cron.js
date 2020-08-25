require('dotenv').config()
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models/index');
module.exports = async nodemailer =>{

    let configEmail, transporter, mail;

    configEmail = {
        service : 'gmail',
        auth    : {
            user: process.env.USER_EMAIL,
            pass: process.env.PASSWORD_EMAIL
        }
    }

    transporter = await nodemailer.createTransport(configEmail)
    await sequelize.query("SELECT * from users WHERE id =:user_id",{replacements:{ user_id : 1},type: QueryTypes.SELECT})
        .then(async (users)=>{
                    for (const key in users) {
                        if (users.hasOwnProperty(key)) {
                            let month = ''
                            const today      = new Date();
                            const year       = today.getFullYear();
                            const mes        = today.getMonth()+1;
                            if (mes.toString.length == 1){
                                month = '0'+mes
                            }else{
                                month = mes
                            }
                            const day        = today.getDate()-1;
                            const time_start = day+"/"+month+"/"+year;
                            const user = users[key];
                            await  sequelize.query("SELECT SUM(harga) as total_harga FROM keuangans where user_id = :user_id AND tanggal = :tanggal",
                            {
                                replacements: {user_id: user.id,
                                               tanggal:time_start},
                                type: QueryTypes.SELECT
                            }).then((total_harga)=>{
                                 mail = {
                                    to:user.email,
                                    from:configEmail.auth.user,
                                    subject: 'Total Pengeluaran',
                                    html : ` Total Pengeluaran Anda kemarin adalah ${total_harga[0].total_harga}`
                                }
                                transporter.sendMail(mail)
                            })
                          
                       }
                    }
        })
    
}