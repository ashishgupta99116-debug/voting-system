const mongoose = require("mongoose") ;
const express = require("express") ;
const dns = require("dns");

// Use alternate DNS servers
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const dotenv = require('dotenv').config() ;

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("connected to mongodb")
    })
    .catch((err) =>{
        console.log("mongodb connection error : " , err); 
    }) ;

    module.exports = mongoose.connection ;