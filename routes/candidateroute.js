const express = require('express') ;
const router= express.Router() ;

const Candidate = require('./../model/candidate') ;
const User = require('./../model/user') ;
const {jwtAuthMiddleware , generatetoken} = require('./../jwt') ;
const candidate = require('./../model/candidate');

const CheckAdminRole = async (userID) => {
    try{
        const user = await User.findById(userID) ;
       if(user.role === 'admin') {
        return true ;
       }else {
        return false;
       }
    }
    catch(err){
        return false ;
    }
}

 // POST route to add candidates
router.post('/' , jwtAuthMiddleware, async (req , res) =>{
    try{

        if(! await CheckAdminRole(req.user.id)){
            return res.status(403).json({message : "user does not have admin role"}) ;
        }else{
            console.log("user have admin role")
        }
        const data = req.body // assuming the request body contain the candidate data 

        // create a new Candidate document using the mongoose model
        const newCandidate = new Candidate(data) ;

        // save the new candidate data to the database
        const response = await newCandidate.save() ;
        console.log('data saved') ;

        res.status(200).json({response : response} ) ;
    }
    catch(err){
        console.log(err) ;
        res.status(500).json({error : 'Internal server error'}) ;
    }
})


// for updating profile password
router.put('/:candidateID' ,jwtAuthMiddleware,  async (req, res)=>{
    try{
        if(! await CheckAdminRole(req.user.id)){
            return res.status(403).json({message : "user does not have admin role"}) ;
        }

        const candidateID = req.params.candidateID ; // id comes in parameter
        const updateCandidatedata = req.body ; // updated data comes in json form

        const response = await Candidate.findByIdAndUpdate(candidateID , updateCandidatedata , {
            new: true , // return the updated document
            runValidators : true , // run mongoose validation
        }) ;

        if(!response){
            console.log("no valid CandidateID");
            return res.status(404).json({message : "no valid CandidateID"}) ;
        }

        console.log("Candidate data updated") ;
        return res.status(500).json(response) ;
    }catch(err){
        console.error(err) ;
        return res.status(500).json({error : 'INTERNAL SERVER ERROR'}) ;
    }
})


router.delete('/:candidateID' ,jwtAuthMiddleware,  async (req, res)=>{
    try{
        if(! await CheckAdminRole(req.user.id)){
            return res.status(403).json({message : "user does not have admin role"}) ;
        }

        const candidateID = req.params.candidateID ; // id comes in parameter

        const response = await Candidate.findByIdAndDelete(candidateID) ;
        if(!response){
           return res.status(404).json({message : "Candidate not found"}) ;
        }

        console.log("Candidate data deleted") ;
        return res.status(500).json(response) ;
    }catch(err){
        console.error(err) ;
        return res.status(500).json({error : 'INTERNAL SERVER ERROR'}) ;
    }
})


// start the voting 

router.post('/vote/:candidateID' , jwtAuthMiddleware , async(req, res) =>{

    // no admin can vote 
    // user can give vote only one time 

    const candidateID = req.params.candidateID ;
    const userID = req.user.id ;

    try{

        // find candidate through its id
        const candidate = await Candidate.findById(candidateID) ;


        if(!candidate){
            return res.status(404).jsong({message : "candidate not found"}) ;
        }

        const user = await User.findById(userID) ;

        if(!user){
            return res.status(404).json({message : "user not found"}) ;
        }


        if(user.isVoted){
            return res.status(400).json({message : "user gave vote already"})
        }
        if(user.role == 'admin'){
            return res.status(403).json({message : "admin is not allowed"}) ;
        }

        // update the candidate document to record the vote
        candidate.votes.push({user : userID}) ;
        candidate.voteCount++;
        await candidate.save() ;

        // update the user document
        user.isVoted = true ;
        await user.save() ;

        return res.status(200).json({message : "Vote recorded successfully"}) ;

    }catch(err){
        console.error(err) ;
        return res.status(500).json({error : 'INTERNAL SERVER ERROR'}) ;
    }

} )


// get the vote count in descending order

router.get('/vote/count' , async(req, res) =>{

    try{

        const candidate = await Candidate.find().sort({voteCount : -1 }) ; // 1 for ascending and  -1 for descending

        // map the candidate with their partyname and votecount

        const  voteRecord = candidate.map((data) =>{
            return {
                party: data.party,
                count: data.voteCount
            };
        })

        return res.status(200).json({voteRecord});
    }catch(err){
        console.error(err) ;
        return res.status(500).json({error : 'INTERNAL SERVER ERROR'}) ;
    }
})


// GET all candidates
router.get('/', jwtAuthMiddleware, async (req, res) => {
    try {
        const candidates = await Candidate.find();

        return res.status(200).json(candidates);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
});


module.exports = router ;