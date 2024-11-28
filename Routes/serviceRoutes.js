const express = require("express");
const { signIn, isAdmin } = require("../Middlewares/authMiddlware");
const { createServController, getServByCatController } = require("../Controllers/ServiceController");
const router = express.Router();


router.post('/create-serv/:categoryId', signIn, isAdmin, createServController);
router.get('/servCat/:catId', signIn, isAdmin, getServByCatController);

module.exports = router;