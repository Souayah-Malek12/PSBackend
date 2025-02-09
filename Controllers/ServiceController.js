const serviceModel = require("../models/Service")
const orderModel = require("../models/OrderServ")

const getServByCatController = async(req, res)=>{
    try{
      const {catId} = req.params;
      const servicesByCat = await serviceModel.find({category :catId});
      return res.status(200).send({
        success : true,
        message: "List of services",
        servicesByCat
      })
    }catch(err){
      return  res.status(500).send({
        success : false,
        message : "Error in  getServByCatController api ",
        error : err.message
    })
    }
  }

  const createServController = async(req, res)=>{
    try{
      const {name } = req.body;
      const {category} = req.params;
      
      const newService = await  serviceModel.create({
        name , category 
      });
      return  res.status(201).send({
        success : true,
        message : "Service created Successfully ",
        newService
        
      })
    }catch(err){
      return  res.status(201).send({
        success : false,
        message : "Error in  createServController api ",
        error : err.message
    })
  }
  }

  const deleteServiceController = async (req, res) => {
    try {
      const { servId } = req.body;
  
      const deletedServ = await serviceModel.findByIdAndDelete(servId);
  
      if (!deletedServ) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Service deleted successfully",
        deletedService: deletedServ
      });
  
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error in deleteServiceController API",
        error: err.message,
      });
    }
  };
  

  module.exports = {getServByCatController, createServController, deleteServiceController}