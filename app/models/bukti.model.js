module.exports = (squelize,Squelize) => {
    const Bukti = squelize.define("buktis",{
        user_id: {
            type: Squelize.INTEGER
        },
        id_kegiatan: {
            type: Squelize.INTEGER
        },
        directory: {
            type: Squelize.STRING
        }
    })
    return Bukti;
}