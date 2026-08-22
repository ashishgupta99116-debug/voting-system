const mongoose = require("mongoose") ;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age : {
        type : Number , 
        required : true 
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    aadhaarHash: {
        type: String,
        required: true,
        unique: true
    },

    hasVoted: {
        type: Boolean,
        default: false
    },

    role: {
        type: String,
        default: "voter"
    }
});


const User = mongoose.model("User" , userSchema) ;
module.exports = User ;
