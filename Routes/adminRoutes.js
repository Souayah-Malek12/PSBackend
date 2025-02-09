const express = require("express")
const { signIn, isAdmin } = require("../Middlewares/authMiddlware")
const { acceptUser } = require("../Controllers/AdminController");
const { getAllUsers } = require("../Controllers/ClientController");

const router = express.Router()

router.put('/accept-user/:userId', signIn, isAdmin, acceptUser);

router.get('/allUsers/:searchedR', signIn, getAllUsers);


module.exports = router