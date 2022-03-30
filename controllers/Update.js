let {UserModel}= require ("../models/user");
//Adding Bcrypt.js ext for Password Encryption
var bcrypt = require('bcryptjs');
//Lodash for stop sending passwords back to user interface
const _ = require("lodash");

let Update = async (req,res)=>{
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
};

module.exports={Update};