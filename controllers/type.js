const {z} = require("zod");
const db = require("../models");


const TypeSchemas = {
    createTypeSchema : z.object({
        title:z.string().min(1,"Title field is Required"),
        value:z.string().min(1,"type Value is Required"),
    }),
    getTypeSchema: z.object({
        typeId:z.string().min(1,"Request Parameter type ID is required")
    }),
}



module.exports = {
    createType: async (req,res,next)=>{
        try{
            const details = TypeSchemas.createTypeSchema.parse(req.body);
            const isCreated = await db.Type.create({...details});
            if(!isCreated) return res.json({success:false,message:"Cannot Create type"});
            return res.json({
                success:true,
                message:"Type Created successfully"
            })
        }catch(err){
            return next(err);
        }
    },
    updateType:async (req,res,next)=>{
        try {
            const {typeId} = TypeSchemas.getTypeSchema.parse(req.params);
            const body = TypeSchemas.createTypeSchema.parse(req.body);
            const isUpdated = await db.Type.update({...body},{where:{id:typeId}});
            if(isUpdated[0] < 1) return res.json({
                success:false,
                message:"Cannot update type"
            });

            return res.json({
                success:true,
                message:"Type Updated successfully"
            })
        } catch (err) {
            return next(err)
        }
    },
    getTypes: async (req,res,next)=>{
        try{
            const types = await db.Type.findAll();
            return res.json({
                success:true,
                data:types
            })
        }catch(err){
            return next(err);
        }
    },
    deleteType: async (req,res,next)=>{
        try {
            const {typeId} = req.params;
            const isDeleted = await db.Type.destroy({
                where:{id:typeId}
            });
            if(isDeleted) return res.json({success:false,message:"Cannot delete Type"});
            return res.json({
                success:true,
                message:"Type deleted successfully"
            })
        } catch (err) {
            return next(err);
        }
    }
}