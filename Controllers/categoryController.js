const serviceCat = require('../models/ServiceCat')

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

const deletecategoryController = async(req, res)=>{
  try{
    const {catId} = req.params;
    const cat = await serviceCat.findById(catId)
    if(!cat){
        return res.status(404).json({
          success: false,
          message: "Catgeory not found  ",
          
        }); 
      }
      const deletedCat = await serviceCat.deleteOne({_id : catId})
      return res.status(200).json({
        success: true,
        message: "Category  deleted Successfully",
        deletedCat
      }); 
}catch(err){
  return  res.status(201).send({
    success : false,
    message : "Error in  deletecategoryController api ",
    error : err.message
})
}
}
module.exports = {getAllCategory, createCateController, deletecategoryController}