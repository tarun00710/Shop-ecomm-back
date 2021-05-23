const express= require('express');

const router =express.Router();

const {User}=require("../Model/user-model.js")

router.post('/',async(req,res) => {
    try{
        const {email,password}=req.body;
        const findUser=await User.findOne({email,password});
        if(findUser){
         
            res.json({success:true,message:"loggedIn successfully"})
        }
        else{
           
            res.json({success:false,message:"LoggedIN failed",status:422})
        }
}catch(err){
   console.log(err);
}})

module.exports=router;