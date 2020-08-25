module.exports = app =>{
    const keuangan = require("../controllers/keuangan.controller")
    const auth = require("../middleware/auth")
    let router = require("express").Router()

    //create new post
     router.post("/find",keuangan.findAll)
     router.post("/",keuangan.create)
     router.put("/edit/:id",keuangan.editKegiatan)
    
    app.use("/api/keuangan",auth.isAuth,router)
}