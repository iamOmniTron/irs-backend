const db = require("../models");
const {z} = require("zod");


const TypeSchemas = {
    gto: z.object({
        title:z.string().min(1,"title is required"),
        value:z.string().min(1,"value is required"),
    }),
    id:z.string().min(1,"turnover id is required")
}




module.exports = {
    createGTO: async (req,res,next)=>{
        try {
            const data = TypeSchemas.gto.parse(req.body);
            const isCreated = await db.GrossTurnOver.create({...data});
            if(!isCreated) return res.json({ success:false,message:"cannot create turnover"});
            return res.json({
                success:true,
                message:"Turnoover created successfully"
            })
        } catch (error) {
            return next(error);
        }
    },
    updateGTO: async (req,res,next)=>{
        try {
            const turnoverId = TypeSchemas.id.parse(req.params.turnoverId);
            const data = TypeSchemas.gto.parse(req.body);
            const isUpdated = await db.GrossTurnOver.update({...data},{where:{id:turnoverId}});
            if(isUpdated[0] < 1) return res.json({
                success:false,
                message:"cannot update turnover"
            });

            return res.json({
                success:true,
                message:"turnover updated successfully"
            });
        } catch (error) {
            return next(error);
        }
    },
    getGTOs: async (_,res,next)=>{
        try {
            const gtos = await db.GrossTurnOver.findAll({include:[{model:db.Tax}]});
            return res.json({
                success:true,
                data:gtos
            })
        } catch (error) {
            return next(error);
        }
    },
    deleteGTO: async (req,res,next)=>{
        try {
            const turnoverId = req.params.turnoverId;
            const isDeleted = await db.GrossTurnOver.destroy({where:{id:turnoverId}});
            if(!isDeleted) return res.json({
                success:false,
                message:"cannot delete turnover"
            })
        } catch (error) {
            return next(error);
        }
    }
}