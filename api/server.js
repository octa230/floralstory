import e from 'express'
import ProductRouter from './routes/productRouter.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'



dotenv.config()

const appServer = e()
appServer.use(e.json())
appServer.use(cors())

appServer.use('/v1/products', ProductRouter)



















const port = 4000
appServer.listen(4000, ()=>{
    console.log(`app server started on port ${port}`)

    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log(`db started`)
    })
})