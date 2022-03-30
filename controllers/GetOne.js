let {UserModel}= require ("../models/user");

let GetOne = async(req,res)=>{
    try{
    let user = await UserModel.findById(req.params.id);
    if(!user) return res.status(400).send("User with given ID is not present");
    return res.send (user); // ALL OKAY
    } 
    catch (err){
    return res.status(400).send("Invalid ID");//FORMAT OF ID INCORRECT
    }};

module.exports={GetOne};