const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try{
        const token= req.header('x-auth-token');
        if(!token)
            return res.status(401).json({msg: "No auth token, access denied"});
        //it is a secret key
        const verified = jwt.verify(token, 'passwordKey');
        //verified contains user id and iat
        if(!verified) return res.status(401).json({msg:
        "Token verification failed, authorization deinied"});
        req.user = verified.id;
        req.token = token;
        //next is used to go to next callback function
        next();

    }catch(err){
     res.status(500).json({error: err.message});
    }
};
module.exports =auth;