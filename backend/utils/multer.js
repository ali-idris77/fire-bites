const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'uploads/temp/')
    },
    filename: (req, file, cb) =>{
        cb(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage,
    limits:{
        fileSize: 5 * 1024 * 1024
    },
    fileFilter(req, file, cb){
        const allowed = /jpeg|jpg|png|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if(ext && mime) cb(null, true)
            else cb(new Error("Only jpeg, jpg, png or webp images allowed."))
    }
})
module.exports = upload;