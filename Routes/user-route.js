const express= require('express');
const mongoose = require('mongoose');
const {userIdCheckHandler} = require('../RouteHandler/userhandler')
const router =express.Router();

const {User}=require("../Model/user-model.js")

router.get('/',async(req,res)=>{
    const users=await User.find({});
    if(users)
    return res.send(users);
    res.send("no users found");
})

router.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user = await User.findOne({email:email,password:password}).populate("cart.product wishlist", ("-__v"));
        if(user){
           return res.status(200).json({success: true,user})
        }
        return res.json({success: false,message:"User doesnt exist"})
    }catch(err){
        res.status(500).json({success: false,message:"Unable to login"})
    }
})

router.get('/:userId',userIdCheckHandler,async (req, res) => {
    try{
      const { user } = req
      return res.status(200).json({success: true, user})
    }catch(error){
      return res.status(500).json({success: false, message:"Could not get the user", errorMessage: error.message})
    }
  })

router.get('/:userId/cart',userIdCheckHandler,async(req, res)=>{
    try{
        const {user} = req;
        const getCart= await User.findById(user._id).select("cart").populate("cart.product","-__v")
        return res.json({success:true,getCart})
    }catch(error){
        res.send(error);
    }
})

router.post('/:userId/cart/:productId',userIdCheckHandler,async(req, res)=>{
    try{
        const {userId,productId}=req.params;
        const productInCart=await User.findById(userId).select("cart");
        const productExists=productInCart.cart.find(cartitem=>String(cartitem.product)===productId)
        if(!productExists){
            const updatedCart = await User.findByIdAndUpdate(userId,{ "$push": { "cart": {"$each": [{product: productId, quantity: 1}], $position: 0,  } } }, {new: true}).select("cart").populate("cart.product",  "-__v");
            return res.json({success: true, updatedCart})
        }
            return res.json({success: false, message: "Product already exists in the Cart"})

        }catch(error){
          return res.status(500).json({success: false, message: "Couldn't update the Cart", errorMessage: error.message})
        }
      })

router.post('/:userId/wishlist/:productId',userIdCheckHandler,async(req, res)=>{
    try {
        const {userId,productId}=req.params;
        const productInWishlist = await User.findById(userId).select("wishlist");
        const productExits=productInWishlist.wishlist.includes(productId);
        if(!productExits){
            const addWishlist =await User.findByIdAndUpdate(userId,{
                    "$push":{
                    "wishlist":productId
                    }
            },{new:true})
           return res.json({success:true,message:addWishlist})
         }
         return res.json({success:false,message:"product already exists"})
    }catch(error) {
           return res.json({error,message:"Unable to add to wishlist"});
        }
    })
router.get('/:userId/wishlist',userIdCheckHandler,async(req, res)=>{
try{
    const {userId}=req.params;
    const getWishlist=await User.findById(userId).select("wishlist").populate("wishlist" ,"-__v");
    return res.send(getWishlist);

}catch(error) {
    return res.error(error);
}
})

//REMOVE 
router.delete('/:userId/wishlist/:productId',userIdCheckHandler,async(req, res)=>{
    try{
        const {userId, productId} =req.params
        const productInWishlist= await User.findByIdAndUpdate(userId,{
            "$pull":{
                "wishlist":productId
            }
        },{new: true}).select("wishlist").populate("wishlist","-__v");
        return res.json({success:true,data:productInWishlist});
    }catch(error) {
        return res.json({success:false,message:"error",error})
    }

})

router.delete('/:userId/cart/:productId',userIdCheckHandler,async(req, res)=>{
    try{
        const{userId,productId}=req.params;
        const updatedCart =await User.findByIdAndUpdate(userId,{
            "$pull":{
                "cart":{product: productId}
            }
        },{new: true}).select("cart").populate("cart.product",  "-__v");

       return res.json({success: true,updatedCart})
    }catch(error) {
       return res.json({success: false,error})
    }
})

router.post('/:userId/updatewishlist/:productId',userIdCheckHandler,async(req,res)=>{
    try{
        const {userId,productId} =req.params;
        const productRemoveWishlist=await User.findByIdAndUpdate(userId,{
            "$pull":{
                "wishlist":productId
            }
        }).select("wishlist").populate("wishlist","-__v");
    
        const productInCart=await User.findById(userId).select("cart");
        const productExits=productInCart.cart.find(cartitem=>String(cartitem.product)===productId)
        if(!productExits){
            const updateCart=await User.findByIdAndUpdate(userId,{
                "$push":{
                    "cart":[{product: productId,quantity:1}]
                }
            },{new: true}).select("cart").populate("cart.product",  "-__v")
           return res.json({success:true,updateCart})
        }
        else{
            const updateQuantity=await User.findByIdAndUpdate(userId,{
                "cart":[{product: productId,quantity:quantity+1}]
            },{new: true}).select("cart").populate("cart.product",  "-__v")
           return res.json({success:true,updateQuantity})
        }
    }
    catch(error){
      return  res.json({success:false,message:"failed to move to cart"+error})
    }
})

//Move to wishlist

router.post('/:userId/updatecart/:productId',userIdCheckHandler,async(req, res)=>{
    try{
        const {userId,productId}=req.params;
        const updateCart=await User.findByIdAndUpdate(userId,{
            "$pull":{
                "cart":{product: productId}
            }
        },{new: true}).select("cart").populate("cart.product",  "-__v")
    const productInWishlist = await User.findById(userId).select("wishlist")    
    const productExists=productInWishlist.wishlist.includes(productId)
    if(!productExists){
        const updatedWishlist =await User.findByIdAndUpdate(userId,{
            "$push":{
                "wishlist":productId
            }
        })
    }
    return res.status(200).json({success:true, updateCart})    

    }
    catch(error){
      return  res.json({success:false,message:"Failed to move to wishlist",error})
    }
})
//IncreaseOrdecreaseQuantity
router.post('/:userId/cart/:productId/update/:type',userIdCheckHandler,async(req,res)=>{
    try{
        const{userId,productId,type}=req.params;
        const userIdObj=mongoose.Types.ObjectId(userId);

        const productIdObj = mongoose.Types.ObjectId(productId);

        if(type==="increaseQuantity"){
            const userData = await User.findOne({_id:userIdObj});
            userData.cart.find((item)=>String(item.product) === String(productIdObj)).quantity = userData.cart.find((item)=>String(item.product)===String(productIdObj)).quantity+1;
            
            const saveUser = await userData.save();
            return res.json({success:true, saveUser})  
        }
        else{
           const userData = await User.findOne({_id:userIdObj})
           console.log(userData.cart.find((item)=>String(item.product) === String(productIdObj)).quantity)
           userData.cart.find((item)=>String(item.product) === String(productIdObj)).quantity = userData.cart.find((item)=>String(item.product)===String(productIdObj)).quantity-1;
           
           
           const saveUser = await userData.save();

           return res.json({success:true,saveUser}) 
        } 
    }catch(err){
        console.log("error",err)
       return res.json({success:false,message:err})
    }
})


module.exports=router;