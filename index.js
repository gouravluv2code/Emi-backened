const express=require("express")
const cors=require("cors")
const { connection } = require("./configs/db")
const { userRouter } = require("./routes/user.routes")
const app=express()
require('dotenv').config()
app.use(cors())
app.use(express.json())

app.use("/users",userRouter)


app.listen(8080,async()=>{
    try {
        await connection
        console.log("connect to database")
    } catch (error) {
        console.log(error)
        console.log("cannot connect to database")
    }
    console.log("server is running on port 8080")
})