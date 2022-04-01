const mongoose = require('mongoose');
const {ProductModel} =require('../Model/product-model');
const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  confirmpassword:{
    type:String,
    required:true
  },
  wishlist:[{type:mongoose.Schema.Types.ObjectId,ref:ProductModel}]
  ,
  cart:[{
    quantity:{type:Number},
    product:{type:mongoose.Schema.Types.ObjectId,ref:ProductModel}
  }
  ]
})

const User = mongoose.model('USER',userSchema);

module.exports ={User};