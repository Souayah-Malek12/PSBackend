const mongoose = require("mongoose")

const OrderServSchema = mongoose.Schema({
    name : {
        type: String,
    },
    details : {
        type: String,
    },
    coordinates :{
        type : [Number],
        required : true,
        index: '2dsphere'
    },
    category : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "ServiceCategory"
    },
    clientId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "user",
    },
    workerId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default : null
    },
    status : {
        type: String,
        enum: ["Pending", "Accepted", "in progress", "completed"],
        default : "Pending"
    },
    desiredDate: {
        type: Date,
       
    },
    createdAt: {
        type: Date,
        default :Date.now
    },
    acceptedAt: {
        type: Date,
        default :Date.now
    },
    finishedAt :{
        type: Date,
    }

})

module.exports = mongoose.model("orderSevice", OrderServSchema);