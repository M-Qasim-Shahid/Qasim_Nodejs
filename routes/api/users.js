//      ====>   USER API    <====

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

//      ====>   IMPORTING CONTROLLERS   <====

//Importing Signup/Login
const Signup= require("../../controllers/SignupLogin");
const Login= require("../../controllers/SignupLogin");
//Importing Insert
const Insert= require("../../controllers/InsertUser");
//Importing Update
const Update= require("../../controllers/Update");
//Importing Delete
const Delete= require("../../controllers/Delete");
//Importing GetAll
const GetAll= require("../../controllers/GetAll");
//Importing GetOne
const GetOne= require("../../controllers/GetOne");
//Importing Get OTP
const GetOtp= require("../../controllers/GetOtp");
//Importing Change Password
const chPassword= require("../../controllers/Password");

//      ====>   API    <====

//SIGN UP ROUTE
    router.post("/register",Signup.Signup);

//LOGIN ROUTE
    router.post("/login",Login.Login);

//INSERT USER (ONLY ADMIN)=> NOT FREQUENTLY USED
    router.post("/insert",auth,admin,Insert.Insert);

//UPDATE USER CREDENTIALS (ADMIN ROLE)
    router.put("/:id",auth,admin,Update.Update);

//DELETE USER (ADMIN ROLE)
    router.delete("/:id",auth,admin,Delete.Delete);

//GET DETAILS OF ALL USERS(ADMIN ROLE)
    router.get("/",auth,admin,GetAll.GetAll);

//GET ONE USER DETAILS (ADMIN ROLE)
    router.get("/:id",auth,admin,GetOne.GetOne);


//      ====>  FORGOT PASSWORD  <====

//GET OTP FOR PASSWORD CHANGE
    router.post("/change-password-otp",auth,GetOtp.GetOtp);

//CHANGE PASSWORD ROUTE
    
    router.post("/change-password",auth,chPassword.chPassword);


    module.exports= router;