const {z} = require("zod");
const { parseURLParam } = require("../utilities/helpers");
const db = require("../models");

const TypeSchemas = {
    createCategorySchema : z.object({
        title:z.string().min(1,"Title field is Required"),
        value:z.string().min(1,"Category Value is Required"),
    }),
    getCategorySchema: z.object({
        categoryId:z.string().min(1,"Request Parameter category ID is required")
    }),
}



module.exports = {
    createCategory: async (req,res,next)=>{
        try{
            const details = TypeSchemas.createCategorySchema.parse(req.body);
            const isCreated = await db.Category.create({...details});
            if(!isCreated) return res.json({success:false,message:"Cannot Create category"});
            return res.json({
                success:true,
                message:"category Created successfully"
            })
        }catch(err){
            return next(err);
        }
    },
    updateCategory:async (req,res,next)=>{
        try {
            const {categoryId} = TypeSchemas.getCategorySchema.parse(req.params);
            const body = TypeSchemas.createCategorySchema.parse(req.body);
            const isUpdated = await db.Category.update({...body},{where:{id:categoryId}});
            if(isUpdated[0] < 1) return res.json({
                success:false,
                message:"Cannot update Category"
            });

            return res.json({
                success:true,
                message:"Category Updated successfully"
            })
        } catch (err) {
            return next(err)
        }
    },
    getCategories: async (_,res,next)=>{
        try{
            // const query = parseURLParam(req.query);
            const categories = await db.Category.findAll();
            return res.json({
                success:true,
                data:categories
            })
        }catch(err){
            return next(err);
        }
    },
    deleteCategory: async (req,res,next)=>{
        try {
            const {categoryId} = req.params;
            const isDeleted = await db.Category.destroy({
                where:{id:categoryId}
            });
            if(isDeleted) return res.json({success:false,message:"Cannot delete Category"});
            return res.json({
                success:true,
                message:"Category deleted successfully"
            })
        } catch (err) {
            return next(err);
        }
    }
}