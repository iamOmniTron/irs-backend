const {z} = require("zod");
const { parseURLParam } = require("../utilities/helpers");
const db = require("../models");

const TypeSchemas = {
    createSizeSchema : z.object({
        title:z.string().min(1,"Title field is Required"),
        value:z.string().min(1,"Size Value is Required"),
    }),
    getSizeSchema: z.object({
        sizeId:z.string().min(1,"Request Parameter size ID is required")
    }),
}



module.exports = {
    createSize: async (req,res,next)=>{
        try{
            const details = TypeSchemas.createSizeSchema.parse(req.body);
            const isCreated = await db.Size.create({...details});
            if(!isCreated) return res.json({success:false,message:"Cannot Create size"});
            return res.json({
                success:true,
                message:"Size Created successfully"
            })
        }catch(err){
            return next(err);
        }
    },
    updateSize:async (req,res,next)=>{
        try {
            const {sizeId} = TypeSchemas.getSizeSchema.parse(req.params);
            const body = TypeSchemas.createSizeSchema.parse(req.body);
            const isUpdated = await db.Size.update({...body},{where:{id:sizeId}});
            if(isUpdated[0] < 1) return res.json({
                success:false,
                message:"Cannot update size"
            });

            return res.json({
                success:true,
                message:"Size Updated successfully"
            })
        } catch (err) {
            return next(err)
        }
    },
    getSizes: async (req,res,next)=>{
        try{
            // const query = parseURLParam(req.query);
            const sizes = await db.Size.findAll();
            return res.json({
                success:true,
                data:sizes
            })
        }catch(err){
            return next(err);
        }
    },
    deleteSize: async (req,res,next)=>{
        try {
            const {sizeId} = req.params;
            const isDeleted = await db.Size.destroy({
                where:{id:sizeId}
            });
            if(isDeleted) return res.json({success:false,message:"Cannot delete Size"});
            return res.json({
                success:true,
                message:"Size deleted successfully"
            })
        } catch (err) {
            return next(err);
        }
    }
}