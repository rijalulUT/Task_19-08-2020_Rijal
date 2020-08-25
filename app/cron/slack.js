var Slack = require('node-slack')
require('dotenv').config()
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models/index');

module.exports = async slack=>{
    var slack = new Slack(process.env.SLACK)
    
    await sequelize.query("SELECT * from users WHERE id =:user_id",{replacements:{ user_id : 1},type: QueryTypes.SELECT})
        .then(async (users)=>{
                    for (const key in users) {
                        if (users.hasOwnProperty(key)) {
                            const user = users[key];
                            await  sequelize.query("SELECT SUM(harga) as total_harga FROM keuangans where user_id = :user_id",
                            {
                                replacements: {user_id: user.id},
                                type: QueryTypes.SELECT
                            }).then((total_harga)=>{
                                slack.send({
                                    text: `User  ${user.nama} | total belanjaan Rp ${total_harga[0].total_harga}`,
                                    channel: process.env.SLACK_CHANNEL,
                                    username: "rijal"
                                })
                            })
                          
                       }
                    }
        })
    
}
