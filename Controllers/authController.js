const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken")

const registreController = async (req, res) => {
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const { name, email, password, phone, coordinates ,profession,role , jobs } = req.body;

        if (!name) {
            return res.send({ error: "Name is Required" });
          }
          if (!email) {
            return res.send({ error: "Email is Required" });
          }
          if (!password) {
            return res.send({ error: "Password is Required" });
          }
          
          if (!phone) {
            return res.send({ error: "Phone no is Required" });
          }
          if (coordinates.length<2) {
            return res.send({ error: "Cordinates are required Latitude and longitude is Required" });
          }
          if (!profession) {
            return res.send({ error: "Profession is Required" });
          }
          if (!role) {
            return res.send({ error: "Role is Required" });
          }

        if (!emailRegex.test(email)) {
            return res.status(400).send({
                success: false,
                message: "Please enter a valid email format"
            });
        }

        const userExist = await userModel.findOne({email});
        if(userExist){
            return res.send({
                success: false,
                message: 'This email is already in use '
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        if(role ==="Client"){
            const user =await userModel.create({
                name,
                email,
                password: hashedPassword,
                phone,
                coordinates,
                profession,
                role,
                isAcceptedByAdmin : true,
                acceptanceDate : Date.now()

            })
            return res.status(201).send({
                success : true,
                message: "Account  created successfully, Welcome to your space",
                user
            }) 
        }
        const user =await userModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            coordinates,
            profession,
            role,
            jobs
        })
        return res.status(201).send({
            success : true,
            message: "Account  created successfully, You Should for Admin acceptance to be able to login",
            user
        })
    }catch(error){
        console.error("Error in user registration:", error);
        return res.status(500).send({
            success: false,
            message: "Error in registre api"
        });
    }}
    const loginController = async(req, res)=>{
        try{
            const {email, password} = req.body;
            const userExist = await userModel.findOne({ email})                                                                                                       
        if(!userExist){
            return res.status(404).send({
                success : false,
                message: "Check your email/password",
            })
        }
        
        const isMatch = await bcrypt.compare(password,  userExist.password)

        if(!isMatch){
            return res.status(401).send({   
                success : false,
                message: "Password do not  match",
                
            })
        }
        const isAccepted = userExist.isAcceptedByAdmin;
        if(!isAccepted){
            return res.status(401).send({
                success : false,
                message : "Please wait until the Admin accept your account"
            })
        }
        const token =  JWT.sign( { id: userExist._id}, process.env.SECRET, {
            expiresIn : '1d'
        })
        
        if(isAccepted){
            return res.status(201).send({
                success : true,
                message : "Logged In Successfully",
                name: userExist.name,
                email :  userExist.email,
                phone : userExist.phone,
                address: userExist.address,
                profession : userExist.profession,
                role: userExist.role,
                token
                
            })
        }
        userExist.password = undefined;
       
        }catch(err){
            console.error("Error in user Login:", err);
        return res.status(500).send({
            success: false,
            message: "Error in login api"
        });
        }
    }
module.exports = {registreController, loginController}