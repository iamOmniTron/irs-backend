const {z} = require("zod");
const db = require("../models");


const DistrictSchemas = {
    createDistrictSchema : z.object({
        title:z.string().min(1,"Title field is Required"),
        name:z.string().min(1,"district Value is Required"),
    }),
    getDistrictSchema: z.object({
        districtId:z.string().min(1,"Request Parameter district ID is required")
    }),
}



module.exports = {
    createDistrict: async (req,res,next)=>{
        try{
            const details = DistrictSchemas.createDistrictSchema.parse(req.body);
            const isCreated = await db.District.create({...details});
            if(!isCreated) return res.json({success:false,message:"Cannot Create district"});
            return res.json({
                success:true,
                message:"District Created successfully"
            })
        }catch(err){
            return next(err);
        }
    },
    updateDistrict:async (req,res,next)=>{
        try {
            const {districtId} = DistrictSchemas.getDistrictSchema.parse(req.params);
            const body = DistrictSchemas.createDistrictSchema.parse(req.body);
            const isUpdated = await db.District.update({...body},{where:{id:districtId}});
            if(isUpdated[0] < 1) return res.json({
                success:false,
                message:"Cannot update district"
            });

            return res.json({
                success:true,
                message:"District Updated successfully"
            })
        } catch (err) {
            return next(err)
        }
    },
    getDistricts: async (req,res,next)=>{
        try{
            const districts = await db.District.findAll({include:[{model:db.LocalGovernmentArea}]});
            return res.json({
                success:true,
                data:districts
            })
        }catch(err){
            return next(err);
        }
    },
    deleteDistrict: async (req,res,next)=>{
        try {
            const {districtId} = req.params;
            const isDeleted = await db.District.destroy({
                where:{id:districtId}
            });
            if(isDeleted) return res.json({success:false,message:"Cannot delete District"});
            return res.json({
                success:true,
                message:"District deleted successfully"
            })
        } catch (err) {
            return next(err);
        }
    }
}