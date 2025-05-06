import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import orderService from '../services/OrderService.js'
import MailingService from '../services/MailingService.js'
import { isAuth } from '../utils.js'



const orderRouter = Router()

orderRouter.post('/', asyncHandler(async(req, res)=>{
    console.log('body', req.body)
    const order = await orderService.PlaceOrder(req.body)
    await MailingService.sendNewOrderEmail(order.user.email, order)
    res.send(order)
}))

orderRouter.get('/', isAuth, asyncHandler(async(req, res)=>{
    console.log('endpoint hit')

    console.log('user', req.user)
    console.log('user', req)
    const orders = await orderService.getOrders(req.user)
    res.send(orders)
}))





export default orderRouter