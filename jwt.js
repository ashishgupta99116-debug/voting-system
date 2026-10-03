const jwt = require("jsonwebtoken") ;

const jwtAuthMiddleware = (req, res, next) => {

    // extract the jwt token from the request headers

    // 1. Check if the authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Token not found. Authorization header is missing.' });
    }

    // 2. Extract the jwt token from the request headers safely
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token format is incorrect.' });
    }

    try{

        // verify the jwt token
        const decoded = jwt.verify(token , process.env.JWT_SECRET) ;

        // Attach user information to the request object

        req.user = decoded ; // user payload
        next() ;
    }catch(err){
        console.error(err) ;
        res.status(401).json({error : 'Invalid Token'}) ;
    }




//     const authHeader = req.headers.authorization;

// console.log("Authorization Header exists:", !!authHeader);

// if (!authHeader) {
//     return res.status(401).json({
//         error: "Authorization header missing"
//     });
// }

// const [scheme, token] = authHeader.split(" ");

// console.log("Authorization Scheme:", scheme);
// console.log("Token exists:", !!token);
// console.log("JWT has three parts:", token?.split(".").length === 3);

// if (scheme !== "Bearer" || !token) {
//     return res.status(401).json({
//         error: "Invalid token format"
//     });
// }



}


// function to generate JwT token
const generatetoken = (userData) => {
    // Generate a new JWT token using user data
    return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn : '7d'}) ;
}

module.exports = {
    jwtAuthMiddleware ,
    generatetoken
} ;