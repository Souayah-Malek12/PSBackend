const express = require("express");
const { signIn } = require("../Middlewares/authMiddlware");
const { chatController, getConversationsController, sendMessageController, getMessageController, getUsersController } = require("../Controllers/ConversationController");

const router = express.Router();

router.post('/Client-Service', signIn, chatController);
router.get('/conversations/:userId', signIn, getConversationsController);
router.get('/messages/:conversationId', signIn, getMessageController);
router.get('/users', signIn, getUsersController);


router.post('/sendMessage', signIn, sendMessageController);



module.exports = router;