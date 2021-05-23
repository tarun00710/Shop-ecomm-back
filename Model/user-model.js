const mongoose = require('mongoose');
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
  }
})
//USER will be collection and User is class
const User = mongoose.model('USER',userSchema);

module.exports ={User};