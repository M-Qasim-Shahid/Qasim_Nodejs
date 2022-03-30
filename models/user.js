// USER MODEL

//Adding JOI for validation
const Joi = require('joi');
//Mongoose for DB connection
var mongoose= require("mongoose");
//Adding Bcrypt.js ext for Password Encryption
var bcrypt = require('bcryptjs');


var userSchema= mongoose.Schema({
name: String ,
email: String ,
password: String,
role: {
    type: String,
    default: "user",
}
});

var UserModel = mongoose.model("User",userSchema);

//VALIDATION OF User for SIGNUP
function validateUserSignup(data){
   const schema =Joi.object({
       name: Joi.string().min(3).max(10).required(),
       email: Joi.string().email().min(3).max(10).required(),
       password: Joi.string().min(3).max(10).required(),
   });
   return schema.validate(data,{abortEarly:false}); 
};

//VALIDATION OF User for LOGIN
function validateUserLogin(data){
    const schema =Joi.object({
       
        email: Joi.string().email().min(3).max(10).required(),
        password: Joi.string().min(3).max(10).required(),
    });
    return schema.validate(data,{abortEarly:false}); 
 };



// MORE EXPORTS FORMAT
module.exports.UserModel= UserModel;
module.exports.validateUserSignup= validateUserSignup; //SIGNUP
module.exports.validateUserLogin= validateUserLogin; //LOGIN



//      PASSWORD ENCRYPTION (Defined in USER API)
//      Methods allow us to perform functions on all users(passwords)
//      
//     userSchema.methods.generateHashedPassword= async function(){
//     let salt= await bcrypt.genSalt(10); //Generates dummy string for randomisation.Used with Await.
//     this.password= await bcrypt.hash(this.password, salt);
// };