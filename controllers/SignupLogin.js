let {UserModel}= require ("../models/user");
//Adding Bcrypt.js ext for Password Encryption
var bcrypt = require('bcryptjs');
//Lodash for stop sending passwords back to user interface
const _ = require("lodash");
// JSON Token (For keeping user record)
const jwt = require ("jsonwebtoken");


let Signup = async (req,res)=>{
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
};

let Login = async (req,res)=>{
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

};

module.exports= {Signup,Login};
