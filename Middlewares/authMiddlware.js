const jwt = require("jsonwebtoken");
const userModel = require("../models/User");

const signIn = (req, res, next)=>{
    try{
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized, token missing' });
        } 
        const decode = jwt.verify(token , process.env.SECRET);
        req.user = decode;
        next();
    }catch(err){
        console.log("SignIn middleware error",err)
    }
}

const isAdmin =async(req, res, next)=>{
    try{
        const user = await userModel.findById(req.user.id);
        if(!user || user.role !== "Administrator"){
            return res.status(401).send({
                success: false,
                message: "UnAuthorized Access(Only Administrator",
              }); 
        }
        next();
    }catch(err){
        console.log("isAdmin middleware error",err)
    }
}
const isServiceClient = async(req, res, next)=>{
    try{
        const user= await userModel.findById(req.user.id);
        if(!user || user.role !== "Service Client" ){
            return res.status(401).send({
                success: false,
                message: "UnAuthorized Access(Only Client Service)",
              }); 
        }
        next();
    }catch(err){
        console.log("isAdmin middleware error",err)

    }
}
module.exports = {isAdmin, signIn, isServiceClient};