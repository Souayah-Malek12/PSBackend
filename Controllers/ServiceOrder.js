const orderModel = require("../models/OrderServ");
const serviceModel = require("../models/Service");
const userModel = require("../models/User");
;

const getNearestOrders = async (req, res) => {
    const { coordinates } = req.body;   //got from login and setted in local storge in the back end
    const catId = await userModel.findById(req.user.id);
    
     // Check if coordinates are provided and in the correct format
    if (!coordinates || coordinates.length !== 2) {
        return res.status(400).json({
            success: false,
            message: 'Invalid coordinates format. Ensure coordinates are [longitude, latitude].'
        });
    }

    const [longitude, latitude] = coordinates; 
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
            return res.status(404).json({
                success: false,
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
            message: 'Error in getNearestOrders API.'
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
    let { details, coordinates, category, desiredTime, desiredDate } = req.body;

    const date = new Date(desiredDate);
    const time = new Date(desiredTime);
    const now = new Date();

    const clientId = req.user.id;
    console.log(coordinates);
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
    const order = orderModel.findById(ordId);
    if(order.status !='Pending'){
      return res.status(409).send({
        success : treu,
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
    if (worker?.availibilty != 0) {
      return res.status(400).send({
        success: false,
        message: "Job acquired for an available worker Only",
      });
    }
    order.workerId = req.user.id;
    order.status = "Accepted";
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

const finishWorkController = async (req, res) => {
  try {
    const { ordId } = req.params;
    const order = await orderModel.findById(ordId);
    order.status = "completed";

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
    const order = await orderModel.findById(ordId);
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

const acceptOrderController =async(req, res)=> {
  try{
    const {orderId} = req.params;
    console.log(orderId);


      const acceptedOrder = await orderModel.findByIdAndUpdate(orderId, { status : "Pending"}, {new :true}) 
      return res.status(200).send({
        success : true ,
        message :' Order accepted Successfully',
        acceptedOrder
      })
  }catch(error){
    return res.status(500).send({
      success: false,
      message: "Error in  acceptOrderController api ",
      error: error.message,
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
  acceptOrderController
};
