const db = require("../models/index")
const dataReq = require('lodash')
const { buktis } = require("../models/index")
const Keuangan = db.keuangans
const User = db.users
const Bukti = db.buktis
const Op = db.Sequelize.Op
const kue  = require("../queue/kue")
require ('../queue/worker')

exports.create = (req, res) =>{
    const token = req.headers.token
    User.findOne({ where: { token: token  },raw : true })
        .then(function (users){
        const id_user = users.id
        const email = users.email
        // Create Post
        const keuangan = {
            kegiatan: req.body.kegiatan,
            tanggal: req.body.tanggal,
            harga: req.body.harga,
            user_id : id_user
        }
        //loop all files (photos)
        Keuangan.create(keuangan)
            .then((data)=>{
                res.send(data)
                data = JSON.parse(JSON.stringify(data, null, 4))
                dataReq.forEach(
                    dataReq.keysIn(req.files.photos),
                    (key) => {
                        let photo = req.files.photos[key]    
                        //move photo to uploads directory
                        photo.mv('./uploads/'+ id_user +'/'+data.id+'/bukti_'+key+'.jpg')
                        let struk = {
                            user_id :id_user,
                            id_kegiatan: data.id,
                            directory : '/uploads/'+ id_user +'/'+data.id+'/bukti_'+key+'.jpg'
                        }
                        Bukti.create(struk)
                    }
                )
                async(req,res) =>{
                    let args = {
                        jobName: "sendEmail",
                        time:15000,
                        params: {
                            email:email,
                            subject:"Pesan Simpan",
                            body:"Data Anda Telah Tersimpan"
                        }
                    };
                    kue.scheduleJob(args)
                }
                
            }).catch((err)=>{
                res.status(500).send({
                    message: err.message || "some error occured while creating Post"
                })
            })
   }).catch((err)=> {
        res.status(500).send({
            message : err.message || "some error occured"
        })
    })

}

exports.findAll = (req,res) =>{
    if (!req.body.tanggal) {
        res.status(400).send(
            {
                message: "masukkan tanggal dengan format tanggal/bulan/tahun (dd/mm/yyyy)"
            }
        )
        return
    }
    const token = req.headers.token
    User.findOne({ where: { token: token  },raw : true })
        .then((users)=> {
            const id_user = users.id
            console.log
            Keuangan.findAll({where : {user_id : id_user, tanggal: req.body.tanggal},raw:true})
                    .then((keuangans)=>{
                       for (const key in keuangans) {
                           if (keuangans.hasOwnProperty(key)) {
                               const keuangan = keuangans[key];
                               Bukti.findAll({where : {user_id : id_user,id_kegiatan: keuangan.id},raw:true})
                                    .then((buktis)=>{
                                        res.send({
                                            nama:`Selamat datang ${users.nama}`,
                                            kegiatan:keuangan.kegiatan,
                                            tanggal:keuangan.tanggal,
                                            bukti: buktis
                                        })
                                    })
                          }
                       }  
                    })
            
        }).catch((err)=> {
            res.status(500).send({
                message : err.message || "some error occured"
            })
        })
}
exports.editKegiatan = (req, res) =>{
    const token = req.headers.token
    const id_kegiatan = req.params.id
    User.findOne({ where: { token: token  },raw : true })
        .then((users)=>{
            const id_user = users.id
            Keuangan.update({
                kegiatan: req.body.kegiatan,
                tanggal:req.body.tanggal,
                harga: req.body.harga
            },{
              where:{id:id_kegiatan,user_id:id_user}
            }).then((result)=>{
                if (result == 1) {
                    dataReq.forEach(
                        dataReq.keysIn(req.files.photos),
                        (key) => {
                            let photo = req.files.photos[key]    
                            //move photo to uploads directory
                            photo.mv('./uploads/'+ id_user +'/'+id_kegiatan+'/bukti_'+key+'.jpg')
                           
                        }
                    )
                    res.send({
                        status: true,
                        message: 'Data Has benn updated',
                        data: {
                            kegiatan: req.body.kegiatan,
                            tanggal:req.body.tanggal,
                            harga: req.body.harga
                        }                                                    
                     })
                }else {
                    res.send({
                             message: `Cannot Update post id = ${id_kegiatan}`
                     })
                 }
            })
        })
} 
