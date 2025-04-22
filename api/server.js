import e from 'express'
import ProductRouter from './routes/productRouter.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import PaymentRouter from './routes/PaymentRouter.js'
import mailRouter from './routes/MailRouter.js'
import AuthRouter from './routes/AuthRouter.js'
import orderRouter from './routes/OrderRouter.js'
import categoryRouter from './routes/categoryRoutes.js'
import navigationRouter from './routes/NavigationRoutes.js'



dotenv.config()

const appServer = e()
appServer.use(e.json())
appServer.use(cors())

appServer.use('/v1/products', ProductRouter)
appServer.use('/v1/categories', categoryRouter)
appServer.use('/v1/navigation', navigationRouter)
appServer.use('/v1/checkout', PaymentRouter)
appServer.use('/v1/placeOrder', orderRouter)
appServer.use('/v1/mail', mailRouter)
appServer.use('/v1/auth', AuthRouter)



















const port = 4000
appServer.listen(4000, ()=>{
    console.log(`app server started on port ${port}`)

    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log(`db started`)
    })
})