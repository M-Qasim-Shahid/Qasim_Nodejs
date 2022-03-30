// const { numberParser } = require("config/parser");
// const { stringify } = require("jade/lib/utils");
const Joi = require('joi');
var mongoose= require("mongoose");

var productSchema= mongoose.Schema({
name: String ,
price: Number,

});

var ProductModel = mongoose.model("Product",productSchema);

//VALIDATION OF PRODUCT
function validateProduct(data){
   const schema =Joi.object({
       name: Joi.string().min(3).max(10).required(),
       price: Joi.number().min(0).required(),
   });
   return schema.validate(data,{abortEarly:false}); 
};


// MORE EXPORTS FORMAT
module.exports.ProductModel= ProductModel;
module.exports.validate= validateProduct;