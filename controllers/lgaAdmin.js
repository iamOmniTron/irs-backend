const db = require('../models');



module.exports = {
    createAdmin: async (req,res,next)=>{
        try {
            const {lgaId,...body} = req.body;
            const isExists = await db.LgaAdmin.findOne({where:{LocalGovernmentAreaId:lgaId}});
            if(isExists) return res.json({
                success:false,
                message:'Admin exists already'
            })
            const isCreated = await db.LgaAdmin.create({...body,LocalGovernmentAreaId:lgaId});
            if(!isCreated) return res.json({
                success:false,
                message:" Cannot create admin"
            });

            return res.json({
                success:true,
                message:"Local government admin created successfully"
            })
        } catch (error) {
            return next(error);
        }
    },
    updateAdmin: async (req,res,next)=>{
        try {
            const {adminId} = req.params;
            const {lgaId,...body} = req.body;
            const isUpdated = await db.LgaAdmin.update({...body,LocalGovernmentAreaId:lgaId},{where:{id:adminId}});
            if(isUpdated[0] < 1) return res.json({
                success:false,
                messsage:"Cannot update admin"
            });

            return res.json({
                success:true,
                message:"admin updated successfully"
            })
        } catch (error) {
            return next(error);
        }
    },
    deleteAdmin: async(req,res,next)=>{
        try {
            const {adminId} = req.params;
            const isDeleted = await db.LgaAdmin.destroy({where:{id:adminId}});
            if(isDeleted < 1) return res.json({
                success:false,
                message:"Cannot delete admin"
            })
        } catch (error) {
            return next(error);
        }
    },
    getAllAdmins: async (req,res,next)=>{
        try {
            const admins = await db.LgaAdmin.findAll({include:[{model:db.LocalGovernmentArea}]});
            return res.json({
                success:true,
                data:admins
            })
        } catch (error) {
            return next(error);
        }
    },
}