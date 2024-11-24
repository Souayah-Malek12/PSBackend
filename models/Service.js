const mongoose = require("mongoose")

const ServiceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique : true
    },
    category : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "ServiceCategory"
    },
})

module.exports = mongoose.model("service", ServiceSchema)