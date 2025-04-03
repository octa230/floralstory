import {v4 as uuidv4 }from 'uuid'

//procuct sku
export const generateUUid = async()=>{
    return uuidv4().slice(0, 7)
}


//slug cleaner
export const stringCleaner =(str)=> {
    return str
    .replace(/[^\w\s-]/gi, '')  // Remove special characters except spaces and hyphens
    .replace(/,/g, '')           // Remove commas   
    .replace(/\s+/g, '-')       // Replace spaces with hyphens
    .replace(/-+/g, '-')        // Replace multiple hyphens with single hyphen
    .toLowerCase();  ;
  }