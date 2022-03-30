let {UserModel}= require ("../models/user");

let GetAll= async (req,res)=>{
    console.log(req.user);
    let page = Number(req.query.page? req.query.page:1);
    let perPage = Number(req.query.perPage? req.query.perPage:10); //prints 10 records per page
    let skipRecords= perPage*(page-1);
    //?page=1&perPage=2 This is the syntax for postman Get request after api
    let user = await UserModel.find().skip(skipRecords).limit(perPage);
    return res.send(user);
};

module.exports={GetAll}

