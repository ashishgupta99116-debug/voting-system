const express = require('express') ;
const router= express.Router() ;

const User = require('./../model/user') ;
 const {jwtAuthMiddleware , generatetoken} = require('./../jwt') ;

router.post('/signup' , async (req , res) =>{

    try{
        const newUser = new User({
            name: req.body.name,
            age: req.body.age,
            email: req.body.email,
            mobilenumber: req.body.mobilenumber,
            address: req.body.address,
            aadhaarcardnumber: req.body.aadhaarcardnumber,
            password: req.body.password
        });

        // save the new User data to the database
        const response = await newUser.save() ;
        console.log('data saved') ;

        const payload = {
            id : response.id 
        }

        console.log(payload);
        const token = generatetoken(payload) ;
        console.log("Token id : " , token) ;
        res.status(201).json({
            message: "Signup successful",
            user: {
                id: response._id,
                name: response.name,
                role: response.role
            },
            token: token
        });
    }
    catch(err){
        console.log(err) ;
        res.status(500).json({error : 'Internal server error'}) ;
    }
})


// login route

router.post('/login' , async ( req, res) => {
    try{
        // extract the username and password
        const {aadhaarcardnumber , password} = req.body ;

        // find the user by username 
        const user = await User.findOne({aadhaarcardnumber : aadhaarcardnumber}) ;

        // if user does not exist or password is incorrect
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error : 'Invalid username or password'}) ;
        }


        const payload = {
            id: user.id 
        }
        const token = generatetoken(payload) ;
        res.json({token}) ;
    }catch(err){
        console.error(err) ;
        res.status(500).json({error : 'Internal server error'}) ;
    }
    
})

// Get method to get the person data 
router.get('/' , async(req, res) => {
    try{
        const data = await User.find() ;
        console.log('User data') ;
        res.status(200).json(data)
    }catch(err){
        console.log(err) ;
        res.status(500).json({error : 'Internal server error'}) ;
    }
})

// // for profile
router.get('/profile' , jwtAuthMiddleware , async (req , res) => {
    try{
        const userData = req.user  ;
        console.log("User data: " , userData) ;

        const userId = userData.id ;
        const user = await User.findById(userId) ;

        res.status(200).json({user}) ;
    }catch(err){
        console.error(err) ;
        res.status(500).json({error : 'INTERNAL SERVER ERROR'}) ;
    }
})

// for updating profile password
router.put('/profile/password',jwtAuthMiddleware ,  async (req, res)=>{
    try{
        const userId =  req.user.id ; // extract the id from the token
        const {currentPassword,  newPassword} =  req.body ;

        //find the user by userId
        const user =  await User.findById(userId) ;

        // if password does not match , return error
        if(!await user.comparePassword(currentPassword)){
            return res.status(401).json({error : 'Invalid password'}) ;
        }

        // update user's password
        user.password =  newPassword ;
        await user.save() ;

        console.log('password updated') ;
        res.status(200).json({message : "password upadated"}) ;
    }catch(err){
        console.error(err) ;
        res.status(500).json({error : 'INTERNAL SERVER ERROR'}) ;
    }
})

module.exports = router ;