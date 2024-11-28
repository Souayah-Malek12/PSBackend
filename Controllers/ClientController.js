const userModel = require("../models/User")


const getAllClients =async(req, res)=>{
    try{
      const clientsList = await userModel.find({role : "Client"});
      if(!clientsList){
        return res.status(404).json({
          success: true,
          message: "Clients List is empty",
          error: err.message,
        });
      }
      return res.status(200).json({
        success: true,
        message: "Clients List",
        clientsList
      });
    }catch(err){
      return res.status(500).json({
        success: false,
        message: "Error in get all Clients user  Api",
        error: err.message,
      });
    }
  }



module.exports = {getAllClients}