let {UserModel}= require ("../models/user");
//IMPORTING OTP MODULE
const otp= require("../models/otp");


let GetOtp = async (req,res)=>{
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
    };

module.exports={GetOtp};