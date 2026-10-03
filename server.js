const dotenv = require("dotenv");
dotenv.config() ;

const express = require("express") ;
const app = express() ;
const db = require("./db") ;
const cors = require("cors");

app.use(cors());

app.use(express.json()) ;

// Import the router files
const userRoutes = require('./routes/userroute') ;
const candidateRoutes = require('./routes/candidateroute')

// use the routers
app.use('/user' , userRoutes) ;
app.use('/candidate' , candidateRoutes ) ;

// Server
const PORT = process.env.PORT || 3000 ;
app.listen(PORT, () => {
    console.log("server is running on port 3000");
});
