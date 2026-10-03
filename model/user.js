const mongoose = require("mongoose") ;
const bcrypt = require("bcrypt") ;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age : {
        type : Number , 
        required : true 
    },
    email :{
        type : String 
    },
    mobilenumber :{
        type : String ,
        required : true 
    },
    address : {
        type : String ,
        required : true 
    },
    aadhaarcardnumber: {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type : String ,
        required : true
    },
    role : {
        type : String ,
        enum : ['voter' , 'admin'],
        default : 'voter'
    },
    isVoted : {
        type : Boolean ,
        default : false
    }
});

userSchema.pre('save' , async function(){
    const person = this;

    // hash the password only if it has been modified or it is new

    if(!person.isModified('password')) return ;

    try{
        // hash password generation 
        const salt = await bcrypt.genSalt(10) ;

        // hash password

        const hashpassword = await bcrypt.hash(person.password , salt) ;
        
        // overwrite the plain password with hash password

        person.password = hashpassword ;
        
    }catch(err){
        throw err ;
    }
})

userSchema.methods.comparePassword = async function(candidatepassword){
    try{  
        // use bcrypt to compare the provided password with the hashed password

        const isMatch = await bcrypt.compare(candidatepassword , this.password) ;
        return isMatch ; 
    }catch(err){
        throw err ;
    }
}


const User = mongoose.model("User" , userSchema) ;

module.exports = User ;
