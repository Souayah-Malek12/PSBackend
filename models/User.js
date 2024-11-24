const mongoose = require("mongoose")

const UserSchema =  mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    email: {
        type: String,
        required: true,
        unique : true
    },
    password : {
        type: String ,
        required : true
    },
    phone :{
        type :Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    profession : {
        type: String,
        enum: [
            'Plombier',
            'Menuisier',
            'Jardinier',
            'Electricien',
            'Mécanicien',
            'Maçon',
            'Peintre',
            'Toiture',
            'Vitreur',
            'Forgeron',
            'Service Client',
            "Client",
            "Administrator"
        ],
    },
    role : {
        type: String ,
        enum : ["Administrator", "Service Client", "Worker", "Client"],
        default : "User"
    },
    jobs: {
        type: Number,
        default : 0
    },
    isAcceptedByAdmin: {
        type: Boolean,
        default : false
    },
    acceptanceDate : {
        type: Date,
        default : null
    }
})

module.exports = mongoose.model("user", UserSchema);