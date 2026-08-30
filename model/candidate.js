const mongoose = require("mongoose") ;

const candidate = new mongoose.Schema({
  name : {
    type : String ,
    required : true
  },
  party : {
    type : String ,
    required : true 
  },
  age : {
    type : Number ,
    required : true 
  },
  votes : [
    {
      user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        required : true 
      },
      votedAt : {
        type : Date ,
        default : Date.now() 
      }
    }
  ],
  votCount : {
    type : Number ,
    default : 0
  }
});

