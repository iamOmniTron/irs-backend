require("dotenv").config();
const {hash,compare} = require("bcrypt");
const {sign,verify} = require("jsonwebtoken");
const multer = require("multer");
const twilio = require("twilio");
const axios = require("axios").default;
const path = require("path")

 const ONE_DAY=86400000;
 const ONE_WEEK=ONE_DAY * 7;
 const ONE_MONTH=ONE_WEEK*4;
 const THREE_MONTHS=ONE_MONTH*3;
 const SIX_MONTHS=THREE_MONTHS*2;
 const ONE_YEAR=SIX_MONTHS*2;

//  const client = twilio(process.env.SMS_SERVICE_ACCOUNT_SID,process.env.SMS_SERVICE_AUTH_TOKEN);


 const storage =  multer.diskStorage({
    destination: function (_, __, cb) {
      cb(null, "./public/users")
    },
    filename: function (_, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })




module.exports = {
    decodeUserToken:(token)=>verify(token,process.env.SECRET_KEY),
    hashPassword:async(password)=> await hash(password,10),
    isPassMatched:async(password,encrypted)=>await compare(password,encrypted),
    parseURLParam:(qs)=>Object.fromEntries(new URLSearchParams(qs))??{},
    genUserAuthToken: (userId,isAdmin)=>sign({userId,isAdmin},process.env.SECRET_KEY,{expiresIn:ONE_DAY}),
    isNullObject:(obj)=>Object.keys(obj) < 1,
    generateTIN:()=>{
        let first = 100 + Math.floor(Math.random() * 999);
        let second = 10 + Math.floor(Math.random() * 99);
        let third = 1000 + Math.floor(Math.random() * 9999);
        const tin = `${first}-${second}-${third}`;
        return tin;
    },
    generateInvoiceNumber:()=>`RF-${100000 + Math.floor(Math.random()*999999)}`,
    generatePaymentReferenceNumber: ()=>{
        let first = 1000 + Math.floor(Math.random() * 9999);
        let second = 100 + Math.floor(Math.random() * 999);
        let third = 1000 + Math.floor(Math.random() * 9999);
        const refNumber = `TxID-${first}-${second}-${third}`;
        return refNumber;
    },
    ONE_DAY,
    ONE_WEEK,
    ONE_MONTH,
    THREE_MONTHS,
    SIX_MONTHS,
    ONE_YEAR,
    upload:multer({storage}),
    generateOTP:()=>100000 + Math.floor(Math.random() * 999999),
    sendOTP: async(code,number)=>{
      const URL = `https://app.multitexter.com/v2/app/sms?email=${process.env.TEXTER_MAIL}&password=${process.env.TEXTER_MAIL_PASSWORD}&sender_name=NSIRS_DEV&message=message=This is your NSIRS login One Time Password (OTP) ${code}&recipients=${number}&forcednd=1`;
      try {
        const {data} = await axios({
          method:"GET",
          url:`${URL}`
        })
        console.log(data);
        return data;
      } catch (error) {
        throw new Error(error)
      }
    },
    formatPhoneNumber:(phone)=>{
      let newNumber;
      switch (phone[0]) {
        case "0":
          newNumber = phone.replace("0","+234");
          break;
        case "+":
          if(phone[1] === "2");
            newNumber = phone;
          break;
        default:
          throw new Error("Invalid User number");
      }
      return newNumber;

    }
}