const userModel = require("../models/User")

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

module.exports = {getActiveWorkers}