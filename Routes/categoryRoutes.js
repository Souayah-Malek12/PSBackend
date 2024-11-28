const express = require("express");
const { signIn, isAdmin } = require("../Middlewares/authMiddlware");
const { createCateController, getAllCategory } = require("../Controllers/categoryController");
const { createServController } = require("../Controllers/ServiceController");


const router = express.Router();

router.post('/create-cat', signIn, isAdmin, createCateController);
router.get('/all-cat/', signIn, isAdmin, getAllCategory );


module.exports = router;