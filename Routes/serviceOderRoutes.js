const express = require("express");
const { signIn, isAdmin } = require("../Middlewares/authMiddlware");
const { passOrderController, updateOrderController, getAllServiceOrders, 
    getServiceOrderByStatus, deleteOrderController, getNearestOrders, 
     getAcquiredOrders, 
     getMyordersController} = require("../Controllers/ServiceOrder");

const router = express.Router();

router.post('/:sId', signIn,passOrderController)

router.put('/updateServ/:orderId', signIn, updateOrderController)

router.get('/all-orders', signIn, isAdmin , getAllServiceOrders);
router.delete('/:ordId', signIn,deleteOrderController)
router.get('/serv-order/:state', signIn,  getServiceOrderByStatus);
router.get('/NearbyOrds', signIn, getNearestOrders);
router.get('/acqOrds/:wId', signIn,  getAcquiredOrders);
router.get('/myOrds/:idCli', signIn,  getMyordersController);








module.exports = router;