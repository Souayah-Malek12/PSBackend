const express = require("express");
const { signIn, isAdmin } = require("../Middlewares/authMiddlware");
const { createServController, getServByCatController, deleteServiceController } = require("../Controllers/ServiceController");
const router = express.Router();


router.post('/create-serv/:category', signIn,  createServController);
router.get('/servCat/:catId',   getServByCatController);
router.delete('/delServ/:servId', signIn,  deleteServiceController);


module.exports = router;