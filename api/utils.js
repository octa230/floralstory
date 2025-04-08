import {v4 as uuidv4 }from 'uuid'
import nodemailer from 'nodemailer'

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