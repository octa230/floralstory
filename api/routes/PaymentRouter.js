import { Router } from "express";
import PaymentService from "../services/PaymentService.js";
import asyncHanlder from 'express-async-handler'


const PaymentRouter = Router()


PaymentRouter.post('/intent', asyncHanlder(async(req, res)=>{
    const {user, totalPrice, items } = req.body
    const intent = await PaymentService.StripeIntent(totalPrice, user)
    res.status(201).send(intent)
}))
export default PaymentRouter