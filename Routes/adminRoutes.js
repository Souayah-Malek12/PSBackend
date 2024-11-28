const express = require("express")
const { signIn, isAdmin } = require("../Middlewares/authMiddlware")
const { acceptUser } = require("../Controllers/AdminController");
const { getAllClients } = require("../Controllers/ClientController");

const router = express.Router()

router.put('/accept-user/:userId', signIn, isAdmin, acceptUser);

router.get('/all-clients', signIn, isAdmin, getAllClients);


module.exports = router