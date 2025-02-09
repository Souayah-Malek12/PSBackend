const { io } = require("../index");
const orderModel = require("../models/OrderServ");
const serviceModel = require("../models/Service");
const userModel = require("../models/User");

const getNearestOrders = async (req, res) => {
    const { coordinates } = req.query;   //got from login and setted in local storge in the back end
    const catId = await userModel.findById(req.user.id);
    console.log("coordinates",coordinates)
    parsedCoordinates = JSON.parse(coordinates);
    console.log("Parsedcoordinates",parsedCoordinates)

     // Check if coordinates are provided and in the correct format
    if (!parsedCoordinates || parsedCoordinates.length !== 2) {
        return res.status(400).json({
            success: false,
            message: 'Invalid coordinates format. Ensure coordinates are [longitude, latitude].'
        });
    }

    const [longitude, latitude] = parsedCoordinates; 
    try {
        const nearestOrders = await orderModel.find({
            status: 'Pending',
            category : catId.profession ,
            coordinates: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude], // [longitude, latitude]
                    },
                    $maxDistance: 1000000 // Optional: Maximum distance in meters (e.g., 10 km)
                }
            }
        }).sort({ "coordinates": 1 }) // Sort by proximity (closest first)

        if (nearestOrders.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No pending orders found near the worker.'
            });
        }

        return res.status(200).json({
            success: true,
            nearestOrders
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error in getNearestOrders API.',
            message2: error.message
        });
    }
};



///////////////////////////////////////://///////////////
const getAllServiceOrders = async (req, res) => {
  try {
    const serviceOrders = await orderModel.find({});
    if (!serviceOrders) {
      return res.status(404).send({
        success: false,
        message: "there is no order already",
      });
    }
    return res.status(200).send({
      success: false,
      message: "Liste of Orders ",
      serviceOrders,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error in  getAllServiceOrders api ",
      error: err.message,
    });
  }
};

const getServiceOrderByStatus = async (req, res) => {
  try {
    const { state } = req.params;
    const serviceByStatus = await orderModel.find({ status: state });
    if (serviceByStatus.length > 0) {
      return res.status(200).send({
        success: true,
        message: `Liste of Orders ${state}`,
        serviceByStatus,
      });
    }
    return res.status(404).send({
      success: false,
      message: "No order founded ",
    });
  } catch (err) {
    return res.status(500).send({
      success: true,
      message: "Error in  getAllServiceOrders api ",
      error: err.message,
    });
  }
};

const passOrderController = async (req, res) => {
  try {
    const { sId } = req.params;
    let { details, coordinates, category, minVal, maxVal,desiredTime, desiredDate } = req.body;
    const date = new Date(desiredDate);
    const time = new Date(desiredTime);
    const now = new Date();

    const clientId = req.user.id;
    if (
      !Array.isArray(coordinates.coordinates) ||
      coordinates.coordinates.length != 2
    ) {
      return res.status(400).send({
        success: false,
        message: "Verfiy your coordinates",
      });
    }
    if (desiredDate === "") {
      desiredDate = Date.now();
    }
    if (desiredTime < now) {
      return res.status(400).send({
        success: false,
        message: "enter a valid time",
        error: err.message,
      });
    }
    if (desiredDate < now.setHours(0, 0, 0, 0)) {
      return res.status(400).send({
        success: false,
        message: "enter a valid date",
        error: err.message,
      });
    }
    const serv = await serviceModel.findById(sId);
    const name = serv.name;

    const order = await orderModel.create({
      name,
      details,
      coordinates,
      category,
      minVal,
      maxVal,
      clientId,
      desiredTime: time,
      desiredDate: date,
    });
    
    return res.status(201).send({
      success: true,
      message:
        "Service Order passed Successfully ,Our workers will treat your demand soon ",
      order,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error in  passOrderController api ",
      error: err.message,
    });
  }
};

const deleteOrderController = async (req, res) => {
  try {
    const { ordId } = req.params;
    const order = await orderModel.findById(ordId);

    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }
    
    if(order.status !='Pending'){
      return res.status(409).send({
        success : false,
        message : "Order already in charge , can't be deleted",

      })
    }
    await orderModel.findByIdAndDelete(ordId);
    return res.status(200).send({
      success: true,
      message: "order deleted successfully",
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error in  deleteOrderController api ",
      error: err.message,
    });
  }
};

const updateOrderController = async (req, res) => {
  try {
    const { name, details, coordinates, desiredTime, desiredDate } = req.body;
    const { orderId } = req.params;
    const orderExist = await orderModel.findById(orderId);
    if (!orderExist) {
      return res.status(404).send({
        success: false,
        message: "order doesn't exist",
      });
    }else if(orderExist.status !='Pending'){
      return res.status(409).send({
        success : true,
        message : "Order already in charge , can't be modified",
        
      })
    }
    if(name) orderExist.name=name;
    if(details) orderExist.details=details;
    if(coordinates) orderExist.coordinates=coordinates;
    if(desiredTime) orderExist.desiredTime=desiredTime;
    if(desiredDate) orderExist.desiredDate=desiredDate;


    const updatedOrder = await orderExist.save();
    return res.status(201).send({
      success: true,
      message: "Order Updated Successfully",
      updatedOrder,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error in  updateOrderController api ",
      error: err.message,
    });
  }
};

const acquireOrderController = async (req, res) => {
  try {
    const { ordId } = req.params;
    const order = await orderModel
      .findById(ordId)
      .populate("clientId", "name phone");
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order already unvailable",
      });
    }
    const worker = await userModel.findById(req.user.id);
    if (!worker?.availibilty) {
      return res.status(400).send({
        success: false,
        message: "Job acquired for an available worker Only",
      });
    }
    order.workerId = req.user.id;
    order.status = "Accepted";
    order.acceptedAt = Date.now();
    worker.availibilty = 1;
    await order.save();
    return res.status(201).send({
      success: true,
      message: "Order acquired Successfully",
      order,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in  acquireOrderController api ",
      error: error.message,
    });
  }
};

const getAcquiredOrders = async (req, res) => {
  try {
    const { wId } = req.params;  // Extract workerId properly

    const ordsListe = await orderModel.find({ workerId: wId }).sort({ acceptedAt: -1 });

    if (ordsListe.length > 0) {
      return res.status(200).json({  // Use 200 for a successful response
        success: true,
        message: "List of acquired orders",
        ordsListe,
      });
    } else {
      return res.status(200).json({  // Still a valid request, so use 200
        success: true,
        message: "No acquired orders yet",
        ordsListe: [],  // Ensure JSON consistency
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in getAcquiredOrder API",
      error: error.message,
    });
  }
};



const finishWorkController = async (req, res) => {
  try {
    const { ordId } = req.params;
    const order = await orderModel.findById(ordId);
    order.status = "completed";
    order.finishedAt = Date.now();

    const worker = await userModel.findById(req.user.id);
    worker.availibilty = 0;
    await worker.save();
    await order.save();

    res.status(200).send({
      success: true,
      message: "Work completed successfully",
      order,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in  finishWorkController api ",
      error: error.message,
    });
  }
};

const inProgressWorkController = async (req, res) => {
  try {
    const { ordId } = req.params;
    const order = await orderModel.findOne({_id :ordId, status: "Accepted"});
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found or not in 'Accepted' status",
      });
    }
    order.status = "in progress";
    await order.save();

    res.status(200).send({
      success: true,
      message: "Work in progress ",
      order,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in  inProgressWorkController api ",
      error: error.message,
    });
  }
};

const getMyordersController = async(req, res)=>{
  try{
    const {idCli} = req.params ;
    const ordsList = await orderModel.find({clientId : idCli});
    if(ordsList===0){
      return res.status(404).json({
        success: true,
        message: " No orders already",
      });
    }
    return res.status(200).json({
      success: true,
      message: "My orders List",
      ordsList
    });
  }catch(err){
    return res.status(500).json({
      success: false,
      message: "Error in get all Clients user  Api",
      error: err.message,
    });
  }
}

module.exports = {
  getAllServiceOrders,
  getServiceOrderByStatus,
  passOrderController,
  updateOrderController,
  deleteOrderController,
  acquireOrderController,
  finishWorkController,
  getNearestOrders,
  inProgressWorkController,
  getAcquiredOrders,
  getMyordersController
};
