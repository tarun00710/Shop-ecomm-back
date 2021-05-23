const mongoose=require('mongoose');

const LoginSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
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
const Logger=mongoose.Model("login",LoginSchema);

module.exports={Logger};