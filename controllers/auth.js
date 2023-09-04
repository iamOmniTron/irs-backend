const {z} = require("zod");
const db = require("../models");
const { isPassMatched, genUserAuthToken, hashPassword } = require("../utilities/helpers");



const TypeSchemas = {
    login: z.object({
        email:z.string().email("E-mail address is required"),
        password:z.string().min(1,"Password is Required")
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
            const {email,password} = TypeSchemas.login.parse(req.body);
            const user = await db.User.findOne({where:{email}});
            if(!user) return next('Invalid E-mail address/Password');
            const isMatched = await isPassMatched(password,user.password);
            if(!isMatched) return next('Invalid E-mail address/Password');
            const token = genUserAuthToken(user.id,false);
            return res.json({
                success:true,
                data:token
            })
        }catch(err){
            return next(err);
        }
    },
    loginAdmin: async (req,res,next)=>{
        try{
            const {userId,password} = TypeSchemas.loginAdmin.parse(req.body);
            const user = await db.Admin.findOne({where:{userId}});
            if(!user) return next('Invalid UserID/Password');
            const isMatched = await isPassMatched(password,user.password);
            if(!isMatched) return next('Invalid UserID/Password');
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
            console.log(userId);
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
    }
}