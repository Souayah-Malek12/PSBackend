const userModel = require("../models/User");
const serviceCat = require("../models/ServiceCat");
const serviceModel = require("../models/Service")


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
  const user = await userModel.findOne({userId : userId});
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

const createCateController = async(req, res)=>{
  try{
    const {name} = req.body;
    const categoryExist = await serviceCat.findOne({name})
    if(categoryExist){
      return res.status(400).send({
        success : false,
        message : "Category already exist"
      })
    }
    const newCat = await  serviceCat.create({
      name
    });
    return  res.status(201).send({
      success : true,
      message : "Category created Successfully ",
      newCat
      
    })
  }catch(err){
    return  res.status(201).send({
      success : false,
      message : "Error in  createCateController api ",
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



const getAllCategory = async(req, res )=> {
    try{
      const categories = await serviceCat.find({});
      return res.status(200).send({
        success : true,
        message: "List of categories",
        categories
      })
    }catch(err){
      return  res.status(201).send({
        success : false,
        message : "Error in  getAllCategory api ",
        error : err.message
    })
    }
}

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
    return  res.status(201).send({
      success : false,
      message : "Error in  getServByCatController api ",
      error : err.message
  })
  }
}
module.exports = {acceptUser, getAllWrokers, getAllClients, getAllClientServicesEmp, getAllUnacceptedEmp,
                  getById, deleteUserController ,createCateController, createServController, getAllCategory, getServByCatController}