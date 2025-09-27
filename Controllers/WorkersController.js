const userModel = require("../models/User");

// Socket.IO instance will be passed from the server
let ioInstance = null;

// Function to set the io instance
const setIO = (io) => {
  ioInstance = io;
  
  ioInstance.on('connection', (socket) => {
    console.log('Client connected to WorkersController');
    
    socket.on('new order', (order) => {
      console.log('New Order Received:', order);
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected from WorkersController');
    });
  });
};

const getActiveWorkers = async(req, res)=>{
    try{
        const workers = await userModel.find({role : "Worker"});
        if(!workers){
            return res.status(404).json({
                success: false,
                message: "no Atcive memebers already ",
                error: err.message,
              });
        }
        return res.status(201).json({
            success: true,
            message: "List of active Workers",
            workers
          });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error in get  getActiveWorkers  Api",
            error: err.message,
          });
    }
}

const getAllWrokers =async (req, res)=>{
    try{
      const workersList = await userModel.find({role : "Worker"});
      if(!workersList){
        return res.status(404).json({
          success: true,
          message: "Workers List is empty",
          error: err.message,
        });
      }
      return res.status(200).json({
        success: true,
        message: "Workers List",
        workersList
      });
    }catch(err){
      return res.status(500).json({
        success: false,
        message: "Error in get all workers user  Api",
        error: err.message,
      });
    }
  }


  const getAllClientServicesEmp =async(req, res)=>{
    try{
      const serviceClientList = await userModel.find({role : "Service Client", isAcceptedByAdmin : true});
      if(!serviceClientList){
        return res.status(404).json({
          success: true,
          message: "Clients List is empty",
          error: err.message,
        });
      }
      return res.status(200).json({
        success: true,
        message: "Service Clients Employee List",
        serviceClientList
      });
    }catch(err){
      return res.status(500).json({
        success: false,
        message: "Error in get all Service Clients Employee   Api",
        error: err.message,
      });
    }
  }

  const getAllUnacceptedEmp =async(req, res)=>{
    try{
      const serviceClientList = await userModel.find({role :{$in :[ "Service Client", "Worker"]}, isAcceptedByAdmin : false});
      if(!serviceClientList){
        return res.status(404).json({
          success: true,
          message: "Clients List is empty",
          error: err.message,
        });
      }
      return res.status(200).json({
        success: true,
        message: "Service Clients Employee List",
        serviceClientList
      });
    }catch(err){
      return res.status(500).json({
        success: false,
        message: "Error in get all Service Clients Employee   Api",
        error: err.message,
      });
    }
  }

  const getById = async(req, res)=>{
    try{
      const {userId} = req.params;
      const user = await userModel.findById(userId);
      if(!user){
        return res.status(404).json({
          success: false,
          message: "User doesn't exist already",
          
        });
      }
      return res.status(200).send({
        success: true,
        message: "User",
        user
      })
    }catch(err){
      return res.status(500).json({
        success: false,
        message: "Error in get  Specific    Api",
        error: err.message,
      });
    }
  }

  const deleteUserController = async(req, res)=>{
    try{
    const {userId} = req.params;
    console.log(userId)
    const user = await userModel.findById(userId);
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User Not found ",
        
      }); 
    }
    const deletedUser = await userModel.deleteOne({_id: userId});
    return res.status(200).json({
      success: true,
      message: "User deleted Succesffully",
      deletedUser
    }); 
    }catch(err){
      return res.status(500).json({
        success: false,
        message: "Error in get  delete user Api",
        error: err.message,
      });
    }
  }
module.exports = {
  setIO,
  getActiveWorkers, 
  getAllWrokers, 
  getAllClientServicesEmp, 
  getAllUnacceptedEmp, 
  getById, 
  deleteUserController
}