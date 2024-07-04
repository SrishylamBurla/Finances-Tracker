const jwt = require("jsonwebtoken")
const User = require("../model/User")

const isAuthenticated = async (req, res, next)=>{
    const headerObj = req.headers

    const token = headerObj?.authentication?.split(' ')[1]
    // console.log(token);

    const verifyToken = jwt.verify(token, "srishylamrk", (err, decoded)=>{
        // console.log(decoded);
        if(err){
            return false
        }else{
            return decoded
        }
    })
    if(verifyToken){
        req.user = verifyToken.id
        next()
    }else{
        const error = 'Session has expired, login again'
        next(error)
    }
    
    
}

module.exports = isAuthenticated