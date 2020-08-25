module.exports = (squelize,Squelize) => {
    const User = squelize.define("users",{
        nama: {
            type: Squelize.STRING
        },
        email: {
            type: Squelize.STRING
        },
        password: {
            type: Squelize.STRING
        },
        photo: {
            type: Squelize.STRING
        },
        token: {
            type: Squelize.STRING
        },
    })
    return User;
}