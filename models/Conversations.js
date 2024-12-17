const mongoose = require("mongoose");

const ConversationSchema = mongoose.Schema({
    members : [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' }
    
    ],
    
}, { timestamps: true })

module.exports = mongoose.model("Conversation", ConversationSchema);