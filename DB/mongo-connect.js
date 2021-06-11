const mongoose = require('mongoose');


function initializeDB(){
  const uri =
  "mongodb+srv://Tarun:Tkat@007@cluster0.dcm3w.mongodb.net/ecomm?retryWrites=true&w=majority"


    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false ,useCreateIndex: true })
    .then(()=>console.log("connection successfull"))
    .catch((error)=>console.error("mongoose connect failed",error))
}
module.exports={initializeDB};