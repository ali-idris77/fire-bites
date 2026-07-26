const sharp = require('sharp');
const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto')

const sharpImg = async (req, res, next)=>{
    try{
        if (!req.file){
            return next()
        }
        const inputPath = req.file.path;
        const filename = `${crypto.randomUUID()}-${Date.now()}.webp`;
        const output = path.join(__dirname,"../uploads/dishes", filename);
        await sharp(inputPath)
        .resize({
            width:1200,
            withoutEnlargement:true
        })
        .webp({
            quality: 80
        })
        .toFile(output);
        
        await fs.unlink(inputPath);

        req.file.filename = filename;
        req.file.path = output;

        next()
    }catch(err){
        console.log(err)
        next()
    }
}
module.exports = sharpImg;