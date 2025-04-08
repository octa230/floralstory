import { Router } from "express";
import AuthService from "../services/AuthService.js";
import asyncHandler from "express-async-handler";


const AuthRouter = Router()


AuthRouter.post('/signup', asyncHandler(async(req, res)=>{
    try{
        const user = await AuthService.SignUpUser(req.body)
        res.status(201).send({
            success: true,
            message: 'User registered successfully. Please check your email for verification.',
            user
        })
    }catch(error){
        console.log(error)
        res.status(201).send({
            success: false,
            message: error.message,
        })
    }
}))


AuthRouter.post('/verify/:userId/:token', asyncHandler(async(req, res)=>{
    try{
        const {userId, token} = req.params
        const result = await AuthService.VerifyUser(userId, token)
        res.send({
            success: true,
            message: 'Email verified successfully',
            user: result
        })

    }catch(error){
        res.send({
            message: error.message,
            status: false
        })
    }
}))


AuthRouter.post('/verify/resend', asyncHandler(async(req, res)=>{
    try{
        const result = await AuthService.VerifyUser(req.params.id)
        res.send({
            success: true,
            message:"Verification Link Resent"
        })
    }catch(error){
        res.send({
            message: error.message,
            success: false
        })
    }
}))

AuthRouter.post('/login', asyncHandler(async(req, res)=>{
    try{
        const {email, password} = req.body
        const result = await AuthService.SignInUser(email, password)
        res.status(200).send({
            success: true,
            message: 'Login successful',
            user: result.user,
            token: result.token
        })
    }catch(error){
        res.send({
            message: error.message,
            success: false
        })
    }
}))




export default AuthRouter