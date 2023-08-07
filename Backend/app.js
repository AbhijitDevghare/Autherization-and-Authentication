require("dotenv").config();

const express=require("express");
const app=express();


const cookieParser = require("cookie-parser");

//middlewear
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}));

//use cors

const cors=require("cors");
app.use(cors({origin:"http://localhost:5500",credentials:true}));

//Database Connection
const connectToDb=require("./config/configDb.js");
connectToDb();

const userRoutes=require("./routers/userRoutes.js");
app.use('/',userRoutes)

module.exports=app;


