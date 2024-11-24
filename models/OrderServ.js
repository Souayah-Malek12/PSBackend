const mongoose = require("mongoose")

const OrderServSchema = mongoose.Schema({
    name : {
        type: String,
        unique: true
    },
    details : {
        type: String,
    },
    category : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "ServiceCategory"
    },
    clientId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    workerId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    status : {
        type: String,
        enum: ["Pending", "Accepted", "in progress", "completed"],
        default : "Pending"
    },
    desiredDate: {
        type: Date,
        default :Date.now
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