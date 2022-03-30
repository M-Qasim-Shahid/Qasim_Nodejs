let {UserModel}= require ("../models/user");

let Delete = async(req,res)=>{
    let user = await UserModel.findByIdAndDelete(req.params.id); 
    return res.send(user);
};
module.exports={Delete};