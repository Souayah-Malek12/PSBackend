const orderModel = require("../models/OrderServ");



const serviceByCat = async (req, res)=>{
    try{    
        const {catId}= req.params;
        const services = await orderModel.find({category : catId});
        if(!services){
            return res.status(404).send({
                success: false,
                message: "no availble service already , Coming soon"
            });
        }
        return res.status(200).send({
            success: true,
            message: "Services List",
            services
        });
        
    }catch(err){
        return res.status(500).send({
            success: false,
            message: "Error in serviceByCat api"
        });
    }
}


const passOrder = async()=>{
    try{
        const {categoryId} = req.params;

        const {clientId, details}= req.body;
    }catch(err){
        return res.status(500).send({
            success: false,
            message: "Error in passOrder api"
        });
    }
}
module.exports = {passOrder, serviceByCat}