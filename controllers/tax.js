const {z} = require("zod");
const db = require("../models");


const TypeSchemas = {
    taxSchema: z.object({
        title:z.string().min(1,"Title is required"),
        value:z.string().min(1,"Value is required"),
        percentage:z.number().min(1,"A Percentage is required"),
        gto:z.number().min(1,"Gross Turn over for Tax is required")
    })
}




module.exports = {
    createTax: async (req,res,next)=>{
        try {
            const {gto,...data} = TypeSchemas.taxSchema.parse(req.body);
            const isCreated = await db.Tax.create({...data,GrossTurnOverId:gto});
            if(!isCreated) return res.json({
                success:false,
                message:"Cannot create Tax"
            });

            return res.json({
                success:true,
                message:"Tax created successfully"
            })
        } catch (error) {
            return next(error);
        }
    },
    updateTax: async (req,res,next)=>{
        try {
            const taxId = +(req.params.taxId);
            const data = TypeSchemas.taxSchema.parse(req.body);
            const isUpdated = await db.Tax.update({...data},{where:{id:taxId}});
            if(isUpdated[0] < 1) return res.json({
                success:false,
                message:"Cannot update Tax"
            });
            return res.json({
                success:true,
                message:"Tax updated successfully"
            })
        } catch (error) {
            return next(error);
        }
    },
    getTaxes: async (_,res,next)=>{
        try {
            const taxes = await db.Tax.findAll({include:[{model:db.GrossTurnOver}]});
            return res.json({
                success:true,
                data:taxes
            })
        } catch (error) {
            return next(error);
        }
    },
    deleteTax: async (req,res,next)=>{
        try {
            const taxId = +(req.params.taxId);
            const isDeleted = await db.Tax.destroy({where:{id:taxId}});
            if(isDeleted < 1) return res.json({
                success:false,
                message:"Tax deleted successfully"
            })
        } catch (error) {
            return next(error);
        }
    }
}