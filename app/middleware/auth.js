const jwt = require("jsonwebtoken")
require('dotenv').config();
module.exports = {
    isAuth: (req,res,next)=>{
        try {
           const token = req.headers.token
           var decoded = jwt.verify(token,process.env.SECRET) // text secret sama dengan di user.controller, biasanya ditaro di env
           req.user = decoded
           next()
        } catch (err) {
            res.status(401).json({
                err: err.message,
                message : 'token is invalid'
            })
        }
    }
}