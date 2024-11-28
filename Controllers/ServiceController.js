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
      const {categoryId} = req.params;
      
      const newService = await  serviceModel.create({
        name , category : categoryId
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

 

  module.exports = {getServByCatController, createServController}