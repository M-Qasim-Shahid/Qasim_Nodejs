//FOR CHECKING ERROR IN SIGN UP (VALIDATION)

const {validateUserSignup} = require("../models/user");

function validateSignup(req,res,next){
    let {error}= validateUserSignup(req.body);
    if(error)
    return res.status(400).send(error.details[0].message);
next();
};

module.exports = validateSignup;
