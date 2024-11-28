const express = require("express");
const { signIn, isAdmin } = require("../Middlewares/authMiddlware");
const { passOrderController, updateOrderController, getAllServiceOrders, getServiceOrderByStatus } = require("../Controllers/ServiceOrder");

const router = express.Router();

router.post('/dserv/:sId', signIn, passOrderController)

router.put('/updateServ/:orderId', signIn, updateOrderController)

router.get('/all-orders', signIn, isAdmin , getAllServiceOrders);
router.get('/serv-order/:state', signIn, isAdmin, getServiceOrderByStatus);


module.exports = router;