require("dotenv").config();
const {hash,compare} = require("bcrypt");

const ONE_DAY=86400000;


module.exports = {
    hashPassword:async(password)=> await hash(password,10),
    isPassMatched:async(password,encrypted)=>await compare(password,encrypted),
    genUserAuthToken: (userId,isAdmin)=>sign({userId,isAdmin},process.env.SECRET_KEY,{expiresIn:ONE_DAY}),
    decodeUserToken:(token)=>verify(token,process.env.SECRET_KEY),
}