const express = require('express');
const router=express.Router();
require('../DB/mongo-connect');

const {User}=require('../Model/user-model');

router.post("/",async(req,res)=>
{
  try{
    const {name,email,password,confirmpassword} = req.body;
    if(password !== confirmpassword)
       return res.status(422).json({error:"please enter same password"});
    const userExist=await(User.findOne({email:email}))
    if(userExist){
      console.log("User already exists")
      return res.status(422).json({success:false,error:"Email already registered",status:422})
    } 
    const user = new User({email,name,password,confirmpassword});
    await user.save();
    res.status(201).json({success:true,message:"User successfully registered"});
    }catch(err) {
      console.log(err);
    } 
})

module.exports=router;
