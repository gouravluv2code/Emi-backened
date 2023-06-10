const express=require("express")
const {UserModel}=require("../models/user.model")
const userRouter=express.Router()
const bcrypt=require("bcrypt")
const jwt =require("jsonwebtoken")
const fs=require("fs")
userRouter.post("/register",async(req,res)=>{
    try {
        const {name,email,password}=req.body
        bcrypt.hash(password, 5, async(err, hash)=> {
            const user=new UserModel({name,email,password:hash})
            await user.save()
            res.status(200).send({msg:"New user has been registerd"})
        });
    } catch (error) {
        res.status(400).send({msg:"error"})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try {
    const user=await UserModel.findOne({email})
    if(user){
        bcrypt.compare(password, user.password, (err, result)=> {
            if(result){
                const token=jwt.sign({authorID:user._id,author:user.name},"masai")
                const timeStamp=new Date().toISOString()
                const name=user.name
                const email=user.email
                const details=`TimeStamp: ${timeStamp} Name:${name} email:${email}`
                fs.writeFileSync("profile.txt",details)
                res.status(200).send({msg:"Login Successfully",token:token,user:user})
            }else{
                res.status(200).send({msg:"Wrong Credentials"})
            }
        });
    }else{
        res.send({msg:"User not Registered"})
    }    
    } catch (error) {
        res.status(400).send({msg:"error"})
    }
})

userRouter.get("/profile",async(req,res)=>{
    const data=fs.readFileSync("./profile.txt","utf-8")
    res.send({data:data})
})




module.exports={
    userRouter
}