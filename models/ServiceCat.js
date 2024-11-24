const mongoose = require("mongoose")

const ServcieCatSchema = mongoose.Schema({
  
        name : {
            type:String,
            required : true,
        },
    
})

module.exports = mongoose.model("ServiceCategory", ServcieCatSchema);