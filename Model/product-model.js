const mongoose=require('mongoose');
const {Schema}=mongoose;

const ProductSchema = new Schema({
  name: {
      type:String,
      required:true,
      unique:true
    },
    image:{
      type:String,
      required:true
    }
  ,
    price:{
      type:Number,
      required:true,
      unique:true
    },
  inStock:{
    type:String,
    required:true,
  },
  fastDelivery:{
    type:String,
    required:true,
  },
  material:{
    type:String
  },
  brand:{
    type:String
  },
  ratings:{
    type:Number
  },
  offer:{
    type:String
  },
  level:{
    type:String,
    required:true,
  }
})

const ProductModel = mongoose.model("Products",ProductSchema);

module.exports={ProductModel};