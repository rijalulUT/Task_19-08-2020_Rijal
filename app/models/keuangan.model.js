module.exports = (squelize,Squelize) => {
    const Keuangan = squelize.define("keuangans",{
        kegiatan: {
            type: Squelize.STRING
        },
        tanggal: {
            type: Squelize.STRING
        },
        harga: {
            type: Squelize.INTEGER
        },
        user_id: {
            type: Squelize.INTEGER
        },
    })
    return Keuangan;
}