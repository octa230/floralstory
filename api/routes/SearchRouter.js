import { Router } from "express";
import asyncHandler from "express-async-handler";
import SearchService from "../services/SearchService.js";

const searchRouter = Router()

searchRouter.get('/', asyncHandler(async(req, res)=>{
    //console.log('endpoint hit')
    try{
        const results = await SearchService.search(req.query)
        res.send(results)
        //console.log(results)
    }catch(error){
        res.status(500).send({
            success: false,
            message: 'Search failed',
            error: error.message
        });
    }
}))

searchRouter.get('/suggestions', asyncHandler(async(req, res)=>{
    try{
        const {q} = req.query
        if (!q) {
            return res.send({
              success: true,
              data: { products: [], categories: [] }
            });
        }
        const results = await SearchService.autocompleteSearch(q)
        res.send(results)
    }catch(error){
        res.status(500).send({
            success: false,
            message: 'Search failed',
            error: error.message
        });
    }
}))


searchRouter.get('/category/:categoryId', asyncHandler(async(req, res)=>{
    try{
     
        const results = await SearchService.searchByCategory(q)
        res.send(results)
    }catch(error){
        res.status(500).send({
            success: false,
            message: 'Search failed',
            error: error.message
        });
    }
}))

export default searchRouter