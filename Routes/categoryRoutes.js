const express = require("express");
const { signIn, isAdmin } = require("../Middlewares/authMiddlware");
const { createCateController, getAllCategory, deletecategoryController } = require("../Controllers/categoryController");
const { createServController } = require("../Controllers/ServiceController");


const router = express.Router();

router.post('/create-cat', signIn,  createCateController);
router.get('/all-cat',  getAllCategory );
router.delete('/del-cat/:catId', signIn,  deletecategoryController );


module.exports = router;