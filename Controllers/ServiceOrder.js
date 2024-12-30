const orderModel = require("../models/OrderServ")
const serviceModel = require("../models/Service")
const userModel = require('../models/User')
const KNN = require('ml-knn'); 


const getNearestOrdersAI = async (req, res) => {
    try {
        // 1. Get worker's location and preferences
        const workerCoordinates = [ 150.2093, -33.8688 ];
        const maxDistance = 300;

        // 2. Get all pending orders
        const orders = await orderModel.find({ status: 'Pending' });
        if (!orders || orders.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No orders available",
                orders: []
            });
        }

        // 3. Process orders
        const processedOrders = orders
            .map(order => {
                if (!order.coordinates?.coordinates) return null;

                // Calculate distance and score
                const distance = getDistance(workerCoordinates, order.coordinates.coordinates);
                const score = Math.max(0, 1 - (distance / maxDistance));
                
                return {
                    ...order.toObject(),
                    distance: Number(distance.toFixed(2)),
                    estimatedTime: calculateTravelTime(distance),
                    score: Number(score.toFixed(2))
                };
            })
            .filter(order => order && order.distance <= maxDistance) // Remove nulls and out-of-range orders
            .sort((a, b) => b.score - a.score); // Sort by score

        // 4. Prepare response
        const recommendations = processedOrders.slice(0, 5).map(order => ({
            orderId: order._id,
            name: order.name,
            location: order.coordinates.coordinates,
            distance: order.distance,
            estimatedTime: order.estimatedTime,
            score: order.score
        }));

        res.status(200).json({
            success: true,
            message: recommendations.length
                ? `Found ${recommendations.length} nearby orders`
                : "No orders within range",
            workerLocation: workerCoordinates,
            recommendations,
            stats: {
                totalOrders: orders.length,
                nearbyOrders: processedOrders.length,
                maxDistance
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: "Error finding nearby orders"
        });
    }
};


// Calculate distance between two points
function getDistance(coord1, coord2) {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    const R = 6371; // Earth's radius in km
    
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function toRad(degrees) {
    return degrees * Math.PI / 180;
}

// Calculate estimated travel time
function calculateTravelTime(distance) {
    const avgSpeed = 30; // km/h
    const hours = distance / avgSpeed;
    if (hours < 1) {
        return `${Math.round(hours * 60)} minutes`;
    }
    const fullHours = Math.floor(hours);
    const minutes = Math.round((hours - fullHours) * 60);
    return `${fullHours} hour${fullHours !== 1 ? 's' : ''} ${minutes} minutes`;
}
























///////////////////////////////////////://///////////////
const getAllServiceOrders = async(req, res)=>{
    try{  
      const serviceOrders = await orderModel.find({});
      if(!serviceOrders  ) {
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
        let {details, coordinates , category,desiredTime, desiredDate }= req.body;

        const date = new Date(desiredDate);
        const time = new Date(desiredTime);
        const now = new Date();

        const clientId = req.user.id;
        console.log(coordinates)
        if(!Array.isArray(coordinates.coordinates) ||  coordinates.coordinates.length!=2){
            return res.status(400).send({
                success: false,
                message: "Verfiy your coordinates",
            });
        }
        if(desiredDate ===""){
            desiredDate =  Date.now();
        }
        if(desiredTime < now){
            return res.status(400).send({
                success : false,
                message:'enter a valid time',
                error : err.message
            })
        }   
        if(desiredDate< now.setHours(0,0,0,0)){
            return res.status(400).send({
                success : false,
                message:'enter a valid date',
                error : err.message
            })
        }
        const  serv = await serviceModel.findById(sId);        
        const name = serv.name;

        const order = await orderModel.create({
            name,
            details,
            coordinates,
            category,
            clientId,
            desiredTime: time,
            desiredDate: date
        })

        return res.status(201).send({
            success: true,
            message : "Service Order passed Successfully ,Our workers will treat your demand soon ",
            order
        })
    }catch(err){
        console.log(err)
        return  res.status(500).send({
            success : false,
            message : "Error in  passOrderController api ",
            error : err.message
        })
    }
  }


  const deleteOrderController = async(req, res)=>{
    try{
        const {ordId} = req.params;
        await orderModel.findByIdAndDelete(ordId);
        return res.status(200).send({
            success : true,
            message : "order deleted successfully",
        })
    }catch(err){
        return  res.status(500).send({
            success : false,
            message : "Error in  deleteOrderController api ",
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
  
  const acquireOrderController = async(req, res)=>{
    try{
        const {ordId} = req.params;
         const order = await orderModel.findById(ordId).populate("clientId", "name phone");
         if(!order){
            return res.status(404).send({
                success :false,
                message: 'Order already unvailable',
            })
         }
         const worker = await userModel.findById(req.user.id);
         if(worker?.availibilty != 0){
            return res.status(400).send({
                success: false,
                message : 'Job acquired for an available worker Only'
            })
         }
         order.workerId = req.user.id;
         order.status = "Accepted";
         worker.availibilty =1;
         await order.save();
         return res.status(201).send({
            success : true,
            message : 'Order acquired Successfully',
            order
         })
    }catch(error){
        return  res.status(500).send({
        success : false,
            message : "Error in  acquireOrderController api ",
            error : error.message
    })
  } }

  const finishWorkController = async(req, res)=>{
    try{
        const {ordId} = req.body;
        const order = await orderModel.findById(ordId);
        order.status ="completed"

        const worker = await userModel.findById(req.user.id);
        worker.availibilty = 0
        await worker.save();
        await order.save();

        res.status(200).send({
            success: true,
            message: "Work completed successfully",
            order
          });
    }catch(error){
        return  res.status(500).send({
        success : false,
        message : "Error in  finishWorkController api ",
        error : error.message
    })
  } 
  }
  module.exports = { getAllServiceOrders, getServiceOrderByStatus, 
        passOrderController, updateOrderController, deleteOrderController,
        acquireOrderController, finishWorkController, getNearestOrdersAI
    }