const {z} = require("zod");
const db = require("../models");


const LocalGovernmentAreaSchemas = {
    createLocalGovernmentAreaSchema : z.object({
        title:z.string().min(1,"Title field is Required"),
        value:z.string().min(1,"localGovernmentArea Value is Required"),
        DistrictId:z.string().min(1,"district is required")
    }),
    getLocalGovernmentAreaSchema: z.object({
        localGovernmentAreaId:z.string().min(1,"Request Parameter localGovernmentArea ID is required")
    }),
}



module.exports = {
    createLocalGovernmentArea: async (req,res,next)=>{
        try{
            const details = LocalGovernmentAreaSchemas.createLocalGovernmentAreaSchema.parse(req.body);
            const isCreated = await db.LocalGovernmentArea.create({...details});
            if(!isCreated) return res.json({success:false,message:"Cannot Create localGovernmentArea"});
            return res.json({
                success:true,
                message:"LocalGovernmentArea Created successfully"
            })
        }catch(err){
            return next(err);
        }
    },
    updateLocalGovernmentArea:async (req,res,next)=>{
        try {
            const {localGovernmentAreaId} = LocalGovernmentAreaSchemas.getLocalGovernmentAreaSchema.parse(req.params);
            const body = LocalGovernmentAreaSchemas.createLocalGovernmentAreaSchema.parse(req.body);
            const isUpdated = await db.LocalGovernmentArea.update({...body},{where:{id:localGovernmentAreaId}});
            if(isUpdated[0] < 1) return res.json({
                success:false,
                message:"Cannot update localGovernmentArea"
            });

            return res.json({
                success:true,
                message:"LocalGovernmentArea Updated successfully"
            })
        } catch (err) {
            return next(err)
        }
    },
    getLGACount:async(_,req,res,next)=>{
        try {
            const count = await db.LocalGovernmentArea.count();
            return  res.json({
                success:true,
                data:count
            })
        } catch (error) {
            return next(error)
        }
    },
    getLocalGovernmentAreas: async (req,res,next)=>{
        try{
            const localGovernmentAreas = await db.LocalGovernmentArea.findAll({include:[{model:db.District}]});
            return res.json({
                success:true,
                data:localGovernmentAreas
            })
        }catch(err){
            return next(err);
        }
    },
    deleteLocalGovernmentArea: async (req,res,next)=>{
        try {
            const {localGovernmentAreaId} = req.params;
            const isDeleted = await db.LocalGovernmentArea.destroy({
                where:{id:localGovernmentAreaId}
            });
            if(isDeleted) return res.json({success:false,message:"Cannot delete LocalGovernmentArea"});
            return res.json({
                success:true,
                message:"LocalGovernmentArea deleted successfully"
            })
        } catch (err) {
            return next(err);
        }
    }
}