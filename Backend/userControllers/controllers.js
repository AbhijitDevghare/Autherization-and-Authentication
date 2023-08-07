const emailValidator=require("email-validator");
const User=require("../model/userSchema.js");
const bcrypt=require("bcrypt");
const crypto = require("crypto");

const home=async (req,resp,next)=>{
   resp.status(200).json({
    success:true,
    message:"Welcome to the home Page"
   })
}


const signup = async (req,resp,next)=>{

      try{

        const { name , username , email , password , confirmPassword , bio } = req.body;

        if(!name || !username  || !email || !password || !confirmPassword )
        {
            return resp.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //validate email

        const validateEmail = await emailValidator.validate(email);
        if(!validateEmail)
        {
           throw new Error("Not a valid email")
        }

        //check password is equal to confirm password

        if( password != confirmPassword )
        {
            throw new Error("Password must be same")
        }


    //    Save The Data 
        const  userInstance = await User(req.body);
        await userInstance.save();

        resp.status(200).json({
            success:true,
            message:"User Created Successfully"
        })



      }catch(error){

        if(error.code === 11000 ) {

            return resp.json({
            message:"User already exists"
            })
        }
         return resp.status(400).json({ 
            success:false,
            message:error.message
        })
      }

}

const login=async (req,resp,next)=>{

    try{

        const { username,password }=req.body;

        //return an error message if username or password is missing
    
        if(!username || !password)
        {
            return resp.status(400).json({
                success:false,
                message:"username and Password are required"
            });
        }

        //check if user exists

        const user = await User.findOne({username})
        .select('+password');

        

        if(!user)
        {
            throw new Error("User doesnt exists")
        }

        const checkPassword = await bcrypt.compare(password,user.password);
        

        if(checkPassword)
        {
            
        const token = await user.jwtToken();
        User.password=undefined;

        const cookieOption =  {
            maxAge : 24*60*60*1000,
            httpOnly:true //It means it cant be accessed from client side
        };

        await resp.cookie("token",token,cookieOption);

            return resp.status(200).json({
                success:true,
                message:"Login SuccessFul",
                data:user
            })
        }
        else{

            return resp.status(400).json({
                success:false,
                message:"Invalid Credentials",
                })
        }  


    }catch(error){


        return resp.status(400).json({
            success:false,
            message:error.message
        })
    }
}


//lOGOUT Controller

const logout = async (req,resp,next)=>{
  
    try{
        const cookieOption={
            expires:new Date(),
            httpOnly:true
        };

        resp.cookie("token",null,cookieOption);
        resp.status(200).json({
            success:true,
            message:"Logged Out"
        })
    } catch(error){
          resp.status(400).json({
            success:true,
            message:error.message
          })
    }

}

// getusercontroller

const getuser = async (req,resp)=>{
    
    const userId = req.user.id;

    try{
        const user = await User.findById(userId);
        return resp.status(200).json({
            success:true,
            data:user
        })
    }catch(error){
        return resp.status(400).json({
            success:false,
            message:error.message
        })
    }
}



module.exports = {
    home,
    signup,
    login,
    logout,
    getuser

}


