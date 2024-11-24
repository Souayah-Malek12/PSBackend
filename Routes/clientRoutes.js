const express = require("express");
const { signIn } = require("../Middlewares/authMiddlware");
const { passOrder } = require("../Controllers/ClientController");

const router = express.Router();



router.post('/dservice', signIn , passOrder)



module.exports = router;