const userModel = require("../models/User")
const orderModel = require('../models/OrderServ')

const getAllUsers =async(req, res)=>{
    try{
      const {searchedR} = req.params;
      const clientsList = await userModel.find({role : searchedR});
      if(clientsList.length ===0){
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

  

module.exports = {getAllUsers}