const db = require("../models");
const {z} = require("zod");
const { parseURLParam, isNullObject, hashPassword, generateTIN } = require("../utilities/helpers");
const path = require("path")


const TypeSchemas = {
    UserSchema: z.object({
        firstname:z.string().min(1,"First name is required"),
        lastname:z.string().min(1,"Last name is required"),
        phone:z.string().min(1,"Phone number is required"),
        email:z.string().email("Email is Required"),
        homeTown:z.string().min(1,"Home town is required"),
        address:z.string().min(1,"User Address is required"),
        gender:z.string().min(1,"Gender is required"),
    }),
    BusinessSchema:z.object({
        name:z.string().min(1,"business name is required"),
        address:z.string().min(1,"business address is required"),
        LocalGovernmentAreaId: z.string().min(1,"business Local government is required"),
        TaxId: z.string().min(1,"business annual turn over is required"),
        establishment:z.string(),
        BillingDurationId: z.string().min(1,"Billing duration is required"),
        SizeId:z.string().min(1,"Business size is required"),
        TypeId:z.string().min(1,"business type is required"),
        CategoryId:z.string().min(1,"Business category is required")
    })
}







module.exports = {
    register: async (req,res,next)=>{
        try {
            const userData = TypeSchemas.UserSchema.parse(req.body.userData);
            const businessData = TypeSchemas.BusinessSchema.parse(req.body.businessData);
            const isUserExist = await db.User.findOne({where:{email:userData.email}});
            if(isUserExist) return res.json({
                success:false,
                mesage:"User Account already exists"
            });
            const tin = generateTIN();
            const user = await db.User.create({...userData,tin});
            if(!user) return res.json({
                success:false,
                message:"cannot register user"
            })
            const business = await db.Business.create({...businessData,UserId:user.id});
            if(!business) return res.json({
                success:false,
                message:"cannot register business"
            });

            return res.json({
                success:true,
                message:"User and business Registration successful"
            })
        } catch (error) {
            return next(error);
        }
    },
    updateUser: async (req,res,next)=>{
        try {
            const userId = req.params.userId;
            const userData = TypeSchemas.UserSchema.parse(req.body);
            const isUpdated = await db.User.update({...userData},{where:{id:userId}});
            if(isUpdated[0] < 1) return res.json({
                success:false,
                message:"cannot update user"
            });
            return res.json({
                success:true,
                message:"user updated successfully"
            })
        } catch (error) {
            return next(error);
        }
    },
    getUsers: async (_,res,next)=>{
        try {
            const users = await db.User.findAll({include:[{model:db.Business,include:[{model:db.Size},{model:db.Type},{model:db.Category},{model:db.BillingDuration},{model:db.Tax,include:[{model:db.GrossTurnOver}]},{model:db.LocalGovernmentArea,include:[{model:db.District}]}]}]});
            return res.json({
                success:true,
                data:users
            })
        } catch (error) {
            return next(error);
        }
    },
    getLgaUser: async (req,res,next)=>{
        try {
        const {userId} = req;
        const admin = await db.LgaAdmin.findOne({where:{id:userId}});
        const users = await db.User.findAll({include:[{model:db.Business,required:true,where:{LocalGovernmentAreaId:admin.LocalGovernmentAreaId},include:[{model:db.Size},{model:db.Type},{model:db.Category},{model:db.BillingDuration},{model:db.Tax,include:[{model:db.GrossTurnOver}]},{model:db.LocalGovernmentArea,include:[{model:db.District}]}]}]});
            return res.json({
                success:true,
                data:users
            })
        } catch (error) {
            return next(error);
        }
    },
    profile: async (req,res,next)=>{
        try{
            const {userId,isAdmin} = req;
            if(!userId || userId === null) return res.status(403).json({
                success:false,
                message:"Unauthenticated"
            });

            if(isAdmin){
                const adminUser = await db.Admin.findOne({where:{id:userId}});
                if(!adminUser || isNullObject(adminUser)) return res.json({success:false,message:"Unauthenticated"});
                return res.json({
                    success:true,
                    data:adminUser
                })
            }
            const user = await db.User.findOne({where:{id:userId},include:[{model:db.Business,include:[{model:db.Size},{model:db.Type},{model:db.Category},{model:db.BillingDuration},{model:db.Tax,include:[{model:db.GrossTurnOver}]},{model:db.LocalGovernmentArea,include:[{model:db.District}]}]}]});
            if(!user || isNullObject(user)) return res.json({success:false,message:"Unauthenticated"});

            return res.json({
                success:true,
                data:user
            })
        }catch(err){
            return next(err);
        }
    },
    uploadImage: async(req,res,next)=>{
        try {
            const {userId} =  req;
            const file = req.file;
            const imageUrl = file.path.replace(/\\/g, "/").substring(7);
            const isUpdated = await db.User.update({imageUrl},{where:{id:userId}});
            if(!isUpdated) return res.json({
                success:false,
                message:"cannot upload image"
            });
            return res.json({
                success:true,
                message:"Image uploaded successfully"
            })
        } catch (error) {
            return next(error);
        }
    },
    approveUser: async (req,res,next)=>{
        const t = await db.sequelize.transaction()
        try {
            const {isAdmin} = req;
            if(!isAdmin) return res.json({
                success:false,
                message:"unauthorized",
            });
            const {userId} = req.params;

            const isUserUpdated = await db.User.update({isConfirmed:true},{where:{id:userId}},{transaction:t});
            if(!isUserUpdated) return res.json({
                success:false,
                message:"Error updating user"
            });
            const isUserBusinessUpdated = await db.Business.update({isRegistered:true},{where:{UserId:userId}},{transaction:t});
            if(!isUserBusinessUpdated) return res.json({
                success:false,
                message:"Error updating user's business"
            });

            return res.json({
                success:true,
                message:"User approved successfully"
            })
        } catch (error) {
            return next(error);
        }
    },
    getLoginSessions: async (req,res,next)=>{
        try {
            const sessions = await db.Login.findAll({include:[{model:db.User}]});
            return res.json({
                success:true,
                data:sessions
            })
        } catch (error) {
            return next(error);
        }
    }
}