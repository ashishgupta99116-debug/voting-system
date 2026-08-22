const express = require("express") ;
const app = express() ;
app.use(express.json()) ;
const dotenv = require("dotenv");

dotenv.config() ;
console.log("Mongo URL:", process.env.MONGODB_URL);


const mongoose  = require("mongoose") ;
mongoose.connect(process.env.MONGODB_URL) 
    .then(() => {
        console.log("connected to mongodb")
    })
    .catch((err) =>{
        console.log("mongodb connection error : " , err); 
    }) ;


// User route
const userRoutes = require("./routes/userroute");

app.use("/users", userRoutes);

const PORT = process.env.PORT || 3000 ;
// Server
app.listen(PORT, () => {
    console.log("server is running on port 3000");
});