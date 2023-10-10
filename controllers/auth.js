const {z} = require("zod");
const db = require("../models");
const { isPassMatched, genUserAuthToken, hashPassword, generateOTP, sendOTP, formatPhoneNumber } = require("../utilities/helpers");



const ONE_SECOND = 1000;



const TypeSchemas = {
    login: z.object({
        email:z.string().email("E-mail address is required"),
    }),
    loginAdmin: z.object({
        userId:z.string().min(1,"User ID is required"),
        password:z.string().min(1,"Password is Required")
    }),
    resetPasswords: z.object({
        currentPassword:z.string().min(1,"Invalid password"),
        newPassword:z.string().min(1,"Invalid password"),
        confirmPassword: z.string().min(1,"Invalid password")
    }).refine(({newPassword,confirmPassword})=> newPassword === confirmPassword,{message:"Passwords dont match"})
}




module.exports = {

    loginUser: async (req,res,next)=>{
        try{
            const {email} = TypeSchemas.login.parse(req.body);
            const user = await db.User.findOne({where:{email}});
            if(!user) return next('Invalid E-mail address');
            const phoneNumber = formatPhoneNumber(user.phone);
            const code = generateOTP();
            console.log(code)
            const TWO_MINUTES = ONE_SECOND * 60 * 2;
            const isSent = await sendOTP(code,phoneNumber);
            if(!isSent) return res.json({
                success:false, 
                message:"Error, resend OTP code"
            })
            const isUpdated = await db.User.update({
                otpCode:code,
                otpExpiration:TWO_MINUTES
            },{
                where:{email}
            });
            if(!isUpdated) return res.json({
                success:false,
                message:"Error, resend OTP code"
            });

            return res.json({
                success:true,
                data:{
                    userId:user.id,
                    code
                }
            })
        }catch(err){
            return next(err);
        }
    },
    confirmUserLogin:async(req,res,next)=>{
        try {
            const {userId} = req.params;
            console.log(userId)
            const {code} = req.body;
            const user = await db.User.findOne({where:{id:userId,otpCode:code}});
            if(!user) return res.json({
                success:false,
                message:"invalid code"
            });
            const isValidCode = Date.now() > user.otpExpiration;
            if(!isValidCode) return res.json({
                success:false,
                message:"OTP Expired already"
            });
            const isUpdated = await db.User.update({otpExpiration:null,otpCode:null},{where:{id:userId}});
            if(!isUpdated) return res.json({
                success:false,
                message:"cannot login user"
            });

            const authToken = genUserAuthToken(userId,false);
            const newSession = await db.Login.create({UserId:user.id,isAdmin:false,time:Date.now()});
            if(!newSession) return res.json({
                success:false,
                message:"cannot login user"
            })
            return res.json({
                success:true,
                data:authToken
            })
        } catch (error) {
            return next(err);
        }
    },
    loginAdmin: async (req,res,next)=>{
        try{
            const {userId,password} = TypeSchemas.loginAdmin.parse(req.body);
            console.log(req.ip);
            const user = await db.Admin.findOne({where:{userId}});
            if(!user) return next('Invalid UserID/Password');
            const isMatched = await isPassMatched(password,user.password);
            if(!isMatched) return next('Invalid UserID/Password');
            const newSession = await db.Login.create({UserId:user.id,isAdmin:true,time:Date.now()});
            if(!newSession) return res.json({
                success:false,
                message:"Error loggin User in"
            })
            const token = genUserAuthToken(user.id,true);
            return res.json({
                success:true,
                data:token
            })
        }catch(err){
            return next(err);
        }
    },
    resetPassword: async(req,res,next)=>{
        try {
            const {userId} = req;
            const {currentPassword,newPassword} = TypeSchemas.resetPasswords.parse(req.body);
            const user = await db.User.findOne({where:{id:userId}});
            if(!user) return res.json({
                success:false,
                message:"Unauthorized"
            });

            const isPassMatch = await isPassMatched(currentPassword,user.password);
            if(!isPassMatch) return res.json({
                success:false,
                message:"Invalid password"
            });
            const hashedPassword = await hashPassword(newPassword);
            await user.update({password:hashedPassword});
            const isUpdated = await user.save();
            if(!isUpdated) return res.json({
                success:false,
                message:"cannot update password"
            });

            return res.json({
                success:true,
                message:"password updated successsfully"
        })
        } catch (error) {
            return next(error);
        }
    },
    adminResetPassword:async(req,res,next)=>{
        const t = await db.sequelize.transaction();
        try {
            const {userId} = req.params;
            const user = await db.User.findOne({where:{id:userId}});
            if(!user) return res.json({
                success:false,
                message:"Invalid User"
            });
            const newPassword = await hashPassword("12345678");
            const isUpdated = await db.User.update({password:newPassword},{where:{id:userId}},{transaction:t});
            if(isUpdated[0] < 1) return res.json({
                success:false,
                message:"Error reseting user password"
            })
            return res.json({
                success:true,
                message:"password reset successful"
            })
        } catch (error) {
            return next(error)
;        }
    }
}