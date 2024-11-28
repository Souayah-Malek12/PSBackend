const userModel = require("../models/User");

const acceptUser = async(req, res)=>{
    try{
    const {userId} = req.params;
    const userExist = await userModel.findOne({_id: userId, role : {$in :["Worker","Service Client"]}});
    if(!userExist){
        return res.status(404).json({
            success: false,
            message: "User doesn't exist",
            
          });
    }
    userExist.isAcceptedByAdmin = true;
    userExist.acceptanceDate = Date.now();
    await userExist.save()
    return res.status(200).json({
        success: true,
        message: "user-account accepted",
        userExist
      });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error in Accept user  Api",
            error: err.message,
          });
    }

}


const getOrderByStatus =()=>{

}
module.exports = {acceptUser,
                  
                     getOrderByStatus}