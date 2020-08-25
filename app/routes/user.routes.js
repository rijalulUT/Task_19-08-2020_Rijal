module.exports = app => {
    const users = require("../controllers/user.controller")

    let router = require("express").Router()

    //create new post
    router.post("/signup",users.signup)
    router.post("/signin",users.signin)
    router.post("/forgot_password",users.forgotPassword)
    app.use("/api/users",router)
}