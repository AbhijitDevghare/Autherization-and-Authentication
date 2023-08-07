const express = require("express");
const jwtAuth=require("../middleware/jwtAuth.js")
const router = express.Router();

const { home , signup , login ,logout, getuser,forgotPassword , resetPassword} = require("../userControllers/controllers.js");

router.get("/",home);
router.post("/signup",signup);
router.post("/login",login);
router.get("/logout",jwtAuth,logout);

router.get("/getuser",jwtAuth,getuser);


module.exports = router