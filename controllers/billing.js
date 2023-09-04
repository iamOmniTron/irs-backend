const {z} = require("zod");
const db = require("../models");


const BillingDurationSchemas = {
    createBillingDurationSchema : z.object({
        title:z.string().min(1,"Title field is Required"),
        duration:z.string().min(1,"billing duration is Required"),
    }),
    getBillingDurationSchema: z.object({
        billingDurationId:z.string().min(1,"Request Parameter billingDuration ID is required")
    }),
}



module.exports = {
    createBillingDuration: async (req,res,next)=>{
        try{
            const details = BillingDurationSchemas.createBillingDurationSchema.parse(req.body);
            const isCreated = await db.BillingDuration.create({...details});
            if(!isCreated) return res.json({success:false,message:"Cannot Create billingDuration"});
            return res.json({
                success:true,
                message:"BillingDuration Created successfully"
            })
        }catch(err){
            return next(err);
        }
    },
    updateBillingDuration:async (req,res,next)=>{
        try {
            const {billingDurationId} = BillingDurationSchemas.getBillingDurationSchema.parse(req.params);
            const body = BillingDurationSchemas.createBillingDurationSchema.parse(req.body);
            const isUpdated = await db.BillingDuration.update({...body},{where:{id:billingDurationId}});
            if(isUpdated[0] < 1) return res.json({
                success:false,
                message:"Cannot update billingDuration"
            });

            return res.json({
                success:true,
                message:"BillingDuration Updated successfully"
            })
        } catch (err) {
            return next(err)
        }
    },
    getBillingDurations: async (req,res,next)=>{
        try{
            const billingDurations = await db.BillingDuration.findAll();
            return res.json({
                success:true,
                data:billingDurations
            })
        }catch(err){
            return next(err);
        }
    },
    deleteBillingDuration: async (req,res,next)=>{
        try {
            const {billingDurationId} = req.params;
            const isDeleted = await db.BillingDuration.destroy({
                where:{id:billingDurationId}
            });
            if(isDeleted) return res.json({success:false,message:"Cannot delete BillingDuration"});
            return res.json({
                success:true,
                message:"BillingDuration deleted successfully"
            })
        } catch (err) {
            return next(err);
        }
    }
}