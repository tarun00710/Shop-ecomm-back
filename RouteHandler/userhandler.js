const {User} = require('../Model/user-model');

const  userIdCheckHandler = async (req, res, next) => {
    try{
    //   console.log(req.params)
      const {userId} = req.params;
      const  user  = await User.findById(userId).populate("cart.product wishlist", ("-__v"));
      if(!user){
        return res.json({success: false, message: "User not found"})
      }
      req.user=user;
  }catch(e){console.log(e)}
  next();
}
module.exports ={userIdCheckHandler};