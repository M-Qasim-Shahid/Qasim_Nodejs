const express = require ("express");
let router = express.Router();
const {ProductModel} = require ("../../models/product");
const validateProduct= require ("../../middlewares/validateProduct");
const auth= require ("../../middlewares/auth");
const admin= require ("../../middlewares/admin");


//GET METHOD
router.get("/",async (req,res)=>{
    console.log(req.user);
    let page = Number(req.query.page? req.query.page:1);
    let perPage = Number(req.query.perPage? req.query.perPage:10); //prints 10 records per page
    let skipRecords= perPage*(page-1);

//?page=1&perPage=2 This is the syntax for postman Get request after api
   let product = await ProductModel.find().skip(skipRecords).limit(perPage);
   return res.send(product);
});

//GET ONE
router.get("/:id",async(req,res)=>{
try{
    let product = await ProductModel.findById(req.params.id);
    if(!product) return res.status(400).send("Product with given ID is not present");
   return res.send (product); // ALL OKAY
} catch (err){
    return res.status(400).send("Invalid ID");//FORMAT OF ID INCORRECT
}
});

// UPDATE PUT
router.put("/:id",validateProduct,async(req,res)=>{
    let product = await ProductModel.findById(req.params.id); 
    product.name = req.body.name;
    product.price = req.body.price;
    await product.save();
    return res.send(product);
});

// DELETE (login plus admin role)
router.delete("/:id",auth,admin,async(req,res)=>{
    let product = await ProductModel.findByIdAndDelete(req.params.id); 
    return res.send(product);
});

//POST (INSERT A RECORD) 
router.post("/",validateProduct,async(req,res)=>{
    //VALIDATION MUST BE DONE(PROPER TECHNIQUE IS MIDDLEWARE)
    // let {error}= validate(req.body);
    // if(error)
    // return res.status(400).send(error.details[0].message);

    let product = new ProductModel();
    product.name = req.body.name;
    product.price = req.body.price;
    await product.save();

    return res.send(product);
});


module.exports= router;


