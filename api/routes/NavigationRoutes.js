import { Router } from "express";
import { syncCategoryToNavigation } from "../services/CategoryService.js";
import { NavigationItem } from "../models/category.js";
import asyncHandler from "express-async-handler";

const navigationRouter = Router()

navigationRouter.post('/', asyncHandler(async(req, res)=>{
    const {category} = req.body

    try {
        const result = await syncCategoryToNavigation(category, req.body);
        res.status(201).send(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}));

navigationRouter.get('/', asyncHandler(async(req, res)=>{
    const categories = await NavigationItem.find({})
    res.send(categories)
}))

export default navigationRouter