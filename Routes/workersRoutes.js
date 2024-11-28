const express= require("express");
const { getActiveWorkers, getAllClientServicesEmp, getAllUnacceptedEmp, getById, deleteUserController, getAllWrokers } = require("../Controllers/WorkersController");
const { isServiceClient, signIn, isAdmin } = require("../Middlewares/authMiddlware");

const router = express.Router();

router.get("/allWorkers", signIn ,isServiceClient, getActiveWorkers);
router.get('/all-scemp', signIn, isAdmin, getAllClientServicesEmp);
router.get('/all-unaccepted', signIn, isAdmin, getAllUnacceptedEmp);
router.get('/all-one/:userId', signIn, isAdmin, getById);


router.delete('/delete-one/:userId', signIn, isAdmin, deleteUserController);
router.get('/all-workers', signIn, isAdmin, getAllWrokers);



module.exports = router;