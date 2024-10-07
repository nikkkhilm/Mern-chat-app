const jwt=require('jsonwebtoken')
const User=require('../models/usermodel')
const asyncHandler=require('express-async-handler')

const protect=asyncHandler(async(req,res,next)=>{
    let token;

//    console.log("10")
//    console.log("Request headers:", req.headers);

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token=req.headers.authorization.split(" ")[1];
            // decodes token id
            // console.log(`Extracted token: ${token}`);
            const decoded =jwt.verify(token,process.env.JWT_SECRET);
            // console.log("before decoded")
            // console.log(decoded)
            req.user=await User.findById(decoded.id).select("-password");
            // console.log(req.user)
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized,Token failed")
        }

        if(!token){
            res.status(401);
            throw new Error("Not authorized,No token")
        }
    }
});

module.exports={protect};