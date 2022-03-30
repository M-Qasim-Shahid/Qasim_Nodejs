//Importing config
const config = require("config");
//Adding JOI for validation
const Joi = require('joi');
//Mongoose for DB connection
var mongoose= require("mongoose");
//Adding Bcrypt.js ext for Password Encryption
var bcrypt = require('bcryptjs');


var otpSchema= mongoose.Schema({
email: String ,
code: String ,
expireIn: Number,
},
{   timestamps:true
});
let otp = mongoose.model("OTP",otpSchema,"OTP");
module.exports= otp;