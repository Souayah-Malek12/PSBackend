const Conversations = require("../models/Conversations");
const userModel = require("../models/User");
const messageModel = require("../models/Messages");

const chatController =async(req, res)=>{
    try{
    const {senderId, receiverId} = req.body;
    const newConversation = await Conversations.create({members : [senderId, receiverId] });
    await newConversation.save();
    res.status(200).send({
        success : true,
        message : 'Conversation created succesffully',
         newConversation
        })
    }catch(err){
        return  res.status(500).send({
            success : false,
            message : "Error in  chatController api ",
            error : err.message
        })
    }
}

const getConversationsController = async(req, res)=>{
    try{
        const userId = req.params.userId;

        const conversations = await Conversations.find({members : { $in: [userId]}})
        
        const conversationsResult = await Promise.all( conversations?.map(async(conversation)=>{
            const userCid = conversation.members.filter((memberId)=>memberId.toString() !==userId);

            const userDetails =  await userModel.findById(userCid[0]).select("name email");
            return {
                conversationId: conversation._id,
            user: userDetails,
        }
        }));
            res.status(200).send({
            success: true,
            message:'Liste of converstaions',
            conversationsResult
            
        });
    }catch(err){
        return  res.status(500).send({
            success : false,
            message : "Error in  getConversationsController api ",
            error : err.message
        })
    }
}

const sendMessageController = async(req, res)=>{
    try{
        const {conversationId, senderId, message,receiverId=''} = req.body;
        if( !senderId || !message){
            return  res.status(400).send({
                success : false,
                message : "Enter missing fields",
                error : err.message
            })
        }
        if(!conversationId ){
            const newConversation = await Conversations.create({members : [senderId, receiverId] });
            const newMessage = await messageModel.create({conversationId: newConversation._id  , senderId, message});
            return res.status(200).send({
                success : true,
                message:' Message sent successfully   "new conversations created ',
                newMessage
            })
        }
        const newMessage = await messageModel.create({conversationId, senderId, message});

        console.log("send Messagecontroller",{conversationId, senderId, message});

        return res.status(200).send({
            success : true,
            message:' Message sent successfully',
            newMessage
        })
       
    }catch(err){
        return  res.status(500).send({
            success : false,
            message : "Error in  sendMessageController api ",
            error : err.message
        })
    }
}

const getMessageController =async(req, res)=>{
    try{
        const conversationId = req.params.conversationId;
        const conversations = await messageModel.find({conversationId});
        const messageUserData = await Promise.all(conversations.map(async(msg)=>{
            const user =  await userModel.findById(msg.senderId).select("name email ");
            return {user : user, message : msg.message}
            
        })
    )  
            return  res.status(201).send({
            success : true,
            message : "Conversation ",
            messageUserData
        })
    }catch(err){
        return  res.status(500).send({
            success : false,
            message : "Error in  getMessageController api ",
            error : err.message
        })
    }
}

const getUsersController = async(req, res)=>{
    try{
        
        const users = await userModel.find().select("name email userId");
        return  res.status(201).send({
            success : true,
            message : "Liste of users",
            users
        });
    }catch(err){
        return  res.status(500).send({
            success : false,
            message : "Error in  getUsersController api ",
            error : err.message
        })
    }
}

module.exports = {chatController, getConversationsController,sendMessageController, getMessageController, getUsersController}