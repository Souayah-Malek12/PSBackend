const orderModel = require("../models/OrderServ")
const serviceModel = require("../models/Service")

const getAllServiceOrders = async(req, res)=>{
    try{  
      const serviceOrders = await orderModel.find({});
      if(!serviceOrders){
        return  res.status(404).send({
          success : false,
          message : "there is no order already",
          
      })
      }
      return  res.status(200).send({
        success : false,
        message : "Liste of Orders ",
        serviceOrders
    })
    }catch(err){
      return  res.status(500).send({
        success : false,
        message : "Error in  getAllServiceOrders api ",
        error : err.message
    })
    }
  }

  const getServiceOrderByStatus = async(req, res)=>{
    try{
        const {state} = req.params;
        const serviceByStatus = await orderModel.find({status : state}) ;
        if(serviceByStatus.length>0){
            return  res.status(200).send({
                success : true,
                message : `Liste of Orders ${state}`,
                serviceByStatus
            })
        }
        return res.status(404).send({
            success : false,
            message :"No order founded "
        })
    }catch(err){
        return  res.status(500).send({
            success : true,
            message : "Error in  getAllServiceOrders api ",
            error : err.message
        })
    }
  }

  const passOrderController = async(req, res)=>{
    try{
        const {sId} = req.params;
        let {details, coordinates , category, desiredDate}= req.body;
        const clientId = req.user.id;
        if(desiredDate ===""){
            desiredDate =  Date.now();
        }
        const  serv = await serviceModel.findById(sId);        
        const name = serv.name;
        const order = await orderModel.create({
            name,
            details,
            coordinates,
            category,
            clientId,
            desiredDate
        })

      

        req.io.emit("new order",{
            orderId: order._id,
            name: order.name,
            details: order.details,
            coordinates: order.coordinates,
            category: order.category,
            clientId: order.clientId,
            desiredDate: order.desiredDate,

        })

        return res.status(201).send({
            success: true,
            message : "Service Order passed Successfully ,Our workers will treat you demand soon ",
            order
        })
    }catch(err){
        return  res.status(500).send({
            success : false,
            message : "Error in  passOrderController api ",
            error : err.message
        })
    }
  }

  const updateOrderController = async(req, res)=>{
    try{
        const {state} = req.body;
        const {orderId} = req.params;
        const orderExist = await orderModel.findById(orderId);
        if(!orderExist){
            return res.status(404).send({
                success : false,
                message :"order doesn't exist",
            })
        }
        orderExist.status = state;
        const updatedOrder = await orderExist.save();
        return res.status(201).send({
            success : true,
            message : 'Order Updated Successfully',
            updatedOrder
        })
    }catch(err){
        return  res.status(500).send({
            success : false,
            message : "Error in  updateOrderController api ",
            error : err.message
        })
    }
  }
  
  module.exports = { getAllServiceOrders, getServiceOrderByStatus, passOrderController, updateOrderController}