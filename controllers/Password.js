let {UserModel}= require ("../models/user");
//IMPORTING OTP MODULE
const otp= require("../models/otp");
//Adding Bcrypt.js ext for Password Encryption
var bcrypt = require('bcryptjs');

let chPassword = async (req,res)=>{
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
        }}
    else{
    return res.send("Invalid Otp");
    }};

module.exports={chPassword};