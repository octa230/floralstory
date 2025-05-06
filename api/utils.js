import {v4 as uuidv4 }from 'uuid'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'

//procuct sku
export const generateUUid = async()=>{
  return uuidv4().slice(0, 7)
}


// Nodemailer transporter setup
export const transporterConfig = ()=> nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'systemsfloral@gmail.com',
    pass: 'txww jnvj bxhe suvn'
  },
   tls: {
    rejectUnauthorized: true
  } 
})
//slug cleaner
export const stringCleaner =(str)=> {
    return str
    .replace(/[^\w\s-]/gi, '')  // Remove special characters except spaces and hyphens
    .replace(/,/g, '')           // Remove commas   
    .replace(/\s+/g, '-')       // Replace spaces with hyphens
    .replace(/-+/g, '-')        // Replace multiple hyphens with single hyphen
    .toLowerCase();  ;
}

export const generateToken=(user)=> {
  const token = jwt.sign({
    _id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
    isVerified: user.isVerified
  }, 
  process.env.JWT_SECRET,
  {expiresIn: '7d'}
)

  return token
}

export const isAuth =(req, res, next)=>{
  const authorization = req.headers.authorization
  //console.log(authorization)

  if(authorization){
    const token = authorization.slice(7, authorization.length) // Bearer XXXXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
      if(err){
        res.status(401).send({ message: 'Invalid Token' });
      }else{
        req.user = decoded
        next()
      }
    })
  }
}