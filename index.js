const express = require('express');
const bodyparser = require('body-parser')
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyparser.json());
app.use(cors())

const {initializeDB} = require('./DB/mongo-connect');
initializeDB();

const productroutes = require('./Routes/product-route');
const registerationroutes = require("./Routes/registration-route");
const userroutes = require("./Routes/user-route");
 
app.use("/products",productroutes);
app.use("/registration",registerationroutes);
app.use("/user",userroutes);

app.use((req , res) => {
  res.status(404).json({ success: false, message: "route not found on server, please check"})
})

app.use((err,res) => {
  res.status(500).json({ success: false, message: "error occured, see the errMessage key for more details", errorMessage: err.message})
})

if(process.env.NODE_ENV === 'production')
  {
    app.use(express.static("client/build"));
  }

app.listen(PORT,()=> console.log(`app is running at port-- ${PORT}`)); 
