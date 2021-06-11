const express= require('express');
const {userIdCheckHandler} = require('../RouteHandler/userhandler')
const router =express.Router();

const {User}=require("../Model/user-model.js")

router.get('/',async(req,res)=>{
    const users=await User.find({});
    if(users)
    res.send(users);
    res.send("no users found");
})
// router.use(userIdCheckHandler); not working will look into it
router.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user = await User.findOne({email:email,password:password}).populate("cart.product wishlist", ("-__v"));
        if(user){
            res.status(200).json({success: true,user})
        }
        res.json({success: false,message:"User doesnt exist"})
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
        res.json({success:true,getCart})
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
            res.json({success: true, updatedCart})
        }
            return res.json({success: false, message: "Product already exists in the Cart"})

        }catch(error){
          res.status(500).json({success: false, message: "Couldn't update the Cart", errorMessage: error.message})
        }
      })

        // }else{
        //    const newQuantity=productExists.quantity+1; 
        //    const quantityUpdate=await User.findByIdAndUpdate(userId,{"cart":[{product: productId, quantity:newQuantity}]},{new: true}).select("cart").populate("cart.product", "-__v");
        //     res.json({success: true, quantityUpdate})
        // }
       
    

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
            res.json({success:true,message:addWishlist})
         }
         res.json({success:false,message:"product already exists"})
    }catch(error) {
            res.json({error,message:"Unable to add to wishlist"});
        }
    })
router.get('/:userId/wishlist',userIdCheckHandler,async(req, res)=>{
try{
    const {userId}=req.params;
    const getWishlist=await User.findById(userId).select("wishlist").populate("wishlist" ,"-__v");
    res.send(getWishlist);

}catch(error) {
    res.error(error);
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
        res.json({success:true,data:productInWishlist});
    }catch(error) {
        res.json({success:false,message:"error",error})
    }

})
//REMOVE from cart

router.delete('/:userId/cart/:productId',userIdCheckHandler,async(req, res)=>{
    try{
        const{userId,productId}=req.params;
        const updatedCart =await User.findByIdAndUpdate(userId,{
            "$pull":{
                "cart":{product: productId}
            }
        },{new: true}).select("cart").populate("cart.product",  "-__v");

        res.json({success: true,updatedCart})
    }catch(error) {
        res.json({success: false,error})
    }
})


//REMOVE from wishlist
// router.delete('/:userId/wishlist/:productId',userIdCheckHandler,async(req,res)=>{
//     try{
//         const updatedWishlist = await User.findByIdAndUpdate(userId,{
//             "$pull":{
//                 "wishlist":productId
//             }
//         }).select("wishlist").populate("wishlist","-__v")
//         res.json(updatedWishlist);
//     }catch(error){
//         res.json({success: false,error})
//     }
// })

//Move to cart
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
            res.json({success:true,updateCart})
        }
        else{
            const updateQuantity=await User.findByIdAndUpdate(userId,{
                "cart":[{product: productId,quantity:quantity+1}]
            },{new: true}).select("cart").populate("cart.product",  "-__v")
            res.json({success:true,updateQuantity})
        }
    }
    catch(error){
        res.json({success:false,message:"failed to move to cart"+error})
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
    res.json({success:true, updateCart})    

    }
    catch(error){
        res.json({success:false,message:"Failed to move to wishlist",error})
    }
})


module.exports=router;