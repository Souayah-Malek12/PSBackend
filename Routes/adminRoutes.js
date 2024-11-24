const express = require("express")
const { signIn, isAdmin } = require("../Middlewares/authMiddlware")
const { acceptUser, getAllWrokers, getAllClients, getAllClientServicesEmp, getAllUnacceptedEmp, getById, deleteUserController, createCateController, createServController, getAllCategory, getServByCatController } = require("../Controllers/AdminController")

const router = express.Router()

router.put('/accept-user/:userId', signIn, isAdmin, acceptUser);

router.get('/all-workers', signIn, isAdmin, getAllWrokers);
router.get('/all-clients', signIn, isAdmin, getAllClients);
router.get('/all-scemp', signIn, isAdmin, getAllClientServicesEmp);
router.get('/all-unaccepted', signIn, isAdmin, getAllUnacceptedEmp);
router.get('/all-one/:userId', signIn, isAdmin, getById);
router.get('/servCat/:catId', signIn, isAdmin, getServByCatController);
router.get('/all-cat/', signIn, isAdmin, getAllCategory);


router.delete('/delete-one/:userId', signIn, isAdmin, deleteUserController);

router.post('/create-cat', signIn, isAdmin, createCateController);
router.post('/create-serv/:categoryId', signIn, isAdmin, createServController);








module.exports = router