import jwt from 'jsonwebtoken'
export const userAuth= async(req,res,next)=>{
const {token}=req.headers;
if(!token)
{
    return res.status(400).json({success:false,message:"Not Authorized Login again"});

}
try{
    const tokenDecode=jwt.verify(token,process.env.JWT_SECRET);
    if(tokenDecode && tokenDecode.id)
    {
        
        req.userId = tokenDecode.id;
    }
    else{
        return res.status(401).json({success:false,message:"Not Authorized. Login Again"})
    }
    next();
}
catch(error)
{
    res.status(401).json({success:false,message:error.message});

}
}