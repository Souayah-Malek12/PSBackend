const mongoose = require("mongoose")

const messagesSchema = mongoose.Schema({
    conversationId:{
       type :String
    },
    senderId : {
         type: mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    message : {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    { timestamps: true }
) 
module.exports = mongoose.model("message",messagesSchema)