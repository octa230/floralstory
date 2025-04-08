import { Router } from "express";
import asyncHandler from 'express-async-handler'
import MailingService from "../services/MailingService.js";
 
const mailRouter = Router()

mailRouter.post('/test', asyncHandler(async(req, res)=> {
    const data = await MailingService.testEmailConfiguration('tradingfloral@gmail.com')
    res.send(data)
}))



export default mailRouter