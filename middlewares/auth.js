// USER AUTHORIZATION (ONLY EXISTED USER CAN USE THIS PATH)

const jwt = require("jsonwebtoken");
const config= require ("config");
const {UserModel} = require ("../models/user");

async function auth(req,res,next){
let token =  req.header("x-auth-token");
if(!token) return res.status(400).send("Token Not Provided");   

try {
let user = jwt.verify(token,config.get("jwtPrivateKey")); 
req.user =await UserModel.findById(user._id);
} catch(err){
    return res.status(401).send("Invalid Token");

}
next();

};

module.exports= auth;