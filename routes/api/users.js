// USER API

const express = require ("express");
let router = express.Router();

let {UserModel}= require ("../../models/user");
//Adding Bcrypt.js ext for Password Encryption
var bcrypt = require('bcryptjs');
//Lodash for stop sending passwords back to user interface
const _ = require("lodash");
// JSON Token (For keeping user record)
const jwt = require ("jsonwebtoken");
//Importing config
const config = require("config");
//IMPORTING AUTH/ ADMIN
const auth= require ("../../middlewares/auth");
const admin= require ("../../middlewares/admin");

//IMPORTING OTP MODULE
const otp= require("../../models/otp");


//SIGN UP ROUTE
router.post("/register",async (req,res)=>{
    
    //Same Email Check
    let user= await UserModel.findOne({email:req.body.email});
    if (user) return res.status(400).send("User with given Email already exists");
    
    user = new UserModel();
    user.name= req.body.name;
    user.email= req.body.email;
    user.password= req.body.password;

    // await user.generateHashedPassword(); // Function should be defined in User Model
    let salt= await bcrypt.genSalt(10); //Generates dummy string for randomisation.Used with Await.
    user.password= await bcrypt.hash(user.password, salt);
    
    await user.save();
    return res.send(_.pick(user,["name","email"]));//using lodash
});


//LOGIN ROUTE
router.post("/login",async (req,res)=>{
    // Email/User Validation
    let user= await UserModel.findOne({email:req.body.email});
    if (!user) return res.status(400).send("User Not Registered");

    //Password Validation
    let isValid =await bcrypt.compare(req.body.password,user.password);
    if(!isValid) return res.status(401).send("Invalid Password");
    let token = jwt.sign ({_id:user._id, name:user.name},
        config.get("jwtPrivateKey"));//data signed by Private key(Better to keep it in another file(CONFIG))

    res.send(token);
    console.log("Logged in Success ");

});

//INSERT USER (ONLY ADMIN)== NOT FREQUENTLY USED
router.post("/insert",auth,admin,async (req,res)=>{
    
    //Same Email Check
    let user= await UserModel.findOne({email:req.body.email});
    if (user) return res.status(400).send("User with given Email already exists");
    
    user = new UserModel();
    user.name= req.body.name;
    user.email= req.body.email;
    user.password= req.body.password;

    // await user.generateHashedPassword(); // Function should be defined in User Model
    let salt= await bcrypt.genSalt(10); //Generates dummy string for randomisation.Used with Await.
    user.password= await bcrypt.hash(user.password, salt);
    
    await user.save();
    return res.send(_.pick(user,["name","email"]));//using lodash
});

//UPDATE USER CREDENTIALS (ADMIN ROLE)
router.put("/:id",auth,admin,async (req,res)=>{
    
    //Same Email Check
    let user= await UserModel.findById(req.params.id);
    
    // if (user) return res.status(400).send("User with given Email already exists");
    // user = new UserModel();
    
    user.name= req.body.name;
    user.email= req.body.email;
    user.password= req.body.password;

    // await user.generateHashedPassword(); // Function should be defined in User Model
    let salt= await bcrypt.genSalt(10); //Generates dummy string for randomisation.Used with Await.
    user.password= await bcrypt.hash(user.password, salt);
    
    await user.save();
    return res.send(_.pick(user,["name","email"]));//using lodash
});

//DELETE USER (ADMIN ROLE)
router.delete("/:id",auth,admin,async(req,res)=>{
    let user = await UserModel.findByIdAndDelete(req.params.id); 
    return res.send(user);
});

//GET DETAILS OF ALL USERS(ADMIN ROLE)
router.get("/",auth,admin,async (req,res)=>{
    console.log(req.user);
   
    let page = Number(req.query.page? req.query.page:1);
    let perPage = Number(req.query.perPage? req.query.perPage:10); //prints 10 records per page
    let skipRecords= perPage*(page-1);

//?page=1&perPage=2 This is the syntax for postman Get request after api
  
    let user = await UserModel.find().skip(skipRecords).limit(perPage);
   return res.send(user);
});

//GET ONE USER DETAILS (ADMIN ROLE)
router.get("/:id",auth,admin,async(req,res)=>{
    try{
        let user = await UserModel.findById(req.params.id);
        if(!user) return res.status(400).send("User with given ID is not present");
       return res.send (user); // ALL OKAY
    } catch (err){
        return res.status(400).send("Invalid ID");//FORMAT OF ID INCORRECT
    }
    });

// PASSWORD RESET
//SEND EMAIL ROUTE
router.post("/change-password-otp",auth,async (req,res)=>{
    let data= await UserModel.findOne({email:req.body.email});
    
    if(data){
        let otpcode = Math.floor(Math.random()*10000+1);
        let otpData = new otp();
        otpData.email =req.body.email;
            otpData.code= otpcode;
            otpData.expireIn= new Date().getTime()+300*1000;
        let otpResponse = await otpData.save();
        return res.send(otpResponse); 


    }

    
    
});

//CHANGE PASSWORD ROUTE
router.post("/change-password",auth,async (req,res)=>{

    let data= await otp.findOne({email:req.body.email, code:req.body.code});
    if(data){
        let currentTime= new Date().getTime();
        let diff= data.expireIn- currentTime;
        if (diff<0){
            return res.send("Token Expired");
        }
        else{
            let user= await UserModel.findOne({email:req.body.email})
            user.password= req.body.password;
            let salt= await bcrypt.genSalt(10); //Generates dummy string for randomisation.Used with Await.
    user.password= await bcrypt.hash(user.password, salt);
            await user.save();
            return res.send("Password Changed Successfuly");
        }
    }else{
        return res.send("Invalid Otp");
    }
    
    
});


module.exports= router;