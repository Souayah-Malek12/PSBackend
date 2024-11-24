const express= require("express");
const { getActiveWorkers } = require("../Controllers/ServiceClientController");
const { isServiceClient, signIn } = require("../Middlewares/authMiddlware");

const router = express.Router();

router.get("/allWorkers", signIn ,isServiceClient, getActiveWorkers)


module.exports = router;