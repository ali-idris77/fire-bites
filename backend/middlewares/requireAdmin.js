const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requireAdminAuth = ( minlevel = 1 )=>{ 
    return async(req, res, next)=>{
    const { authorization } = req.headers

    if(!authorization ){
        return res.status(401).json({code:'NO_TOKEN',error : "Authorization token required"})
    }
    const token = authorization.split(' ')[1]
    try{
       const {id} = jwt.verify(token, process.env.SECRET)

       const admin = await User.findById(id)

       if(!admin) return res.status(401).json({code:'NO_USER',error: "User data not found"})

        if(admin.level < minlevel) return res.status(403).json({error: "Access Denied"})
       req.admin = {id:admin.id, level:admin.level}
       next()
    }catch(error){
        res.status(401).json({code:'TOKEN_EXPIRED',error: "Request is not authorized"})
    }
}
}
module.exports = requireAdminAuth