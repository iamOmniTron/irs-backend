const express = require("express");
const {ZodError} = require("zod");
const cors = require("cors");
const logger = require("morgan");
const router = require("./router");

require("./__dbinit")()

const app = express();

app.use(cors({origin:"*"}))
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("*",(_,res,next)=>{
    res.header("Cache-control","no-cache, no-store, must-revalidate");
    res.header("Pragma","no-cache");
    res.header("Expires",0);

    return next();
})

app.disable("etag");


app.use("/api",router);

app.use((err,_,res,__)=>{
    try {
        if(err){
            console.log(err);
            if(err.name == "JsonWebTokenError"){
                return res.status(401).json({
                    success:false,
                    message:"User Unauthenticated"
                })
            }
            if(err instanceof ZodError){
                let msg = "";
                err.issues.forEach(e=>{
                    msg +=`${e.message}, `
                })
                return res.status(400).json({
                    success:false,
                    message:msg
                })
            }
            if(err instanceof Error){
                return res.status(500).json({
                    success:false,
                    message:err.message
                })
            }
        }
        return res.status(500).json({
            success:false,
            message:err
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
});


module.exports = app;
