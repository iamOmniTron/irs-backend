const db = require("../models");
const { generateInvoiceNumber } = require("../utilities/helpers");

// Statuses => pending, successful


module.exports = {
    generatenInvoice: async(req,res,next)=>{
        try {
            const {userId} = req;
            const {amount} = req.body;
            const userBusiness = await db.Business.findOne({where:{UserId:userId}});
            if(!userBusiness) return res.json({
                success:false,
                message:"Unauthenticated"
            });
            const IN = generateInvoiceNumber();
            const newInvoice = await db.Invoice.create({invoiceNumber:IN,BusinessId:userBusiness.id,status:"pending",amount});
            if(!newInvoice) return res.json({
                success:false,
                message:"cannot generate invoice at the moment"
            });
            return res.json({
                success:true,
                data:newInvoice
            })
        } catch (error) {
            return next(error);
        }
    },
    getMyInvoices: async (req,res,next)=>{
        try {
            const {userId} = req;
            const invoices = await db.Invoice.findAll({include:[{model:db.Business,where:{UserId:userId},required:true}]});
            return res.json({
                success:true,
                data:invoices
            })
        } catch (error) {
            return next(error);
        }
    },
    getAllInvoices: async (_,res,next)=>{
        try {
            const invoices = await db.Invoice.findAll({include:[{model:db.Business}]});
            return res.json({
                success:true,
                data:invoices
            })
        } catch (error) {
            return next(error);
        }
    },
    getLgaInvoices: async (req,res,next)=>{
        try {
            const {userId} = req;
            const user = await db.LgaAdmin.findOne({where:{id:userId}});
            const invoices = await db.Invoice.findAll({include:[{model:db.Business,required:true,where:{LocalGovernmentAreaId:user.LocalGovernmentAreaId}}]});
            return res.json({
                success:true,
                data:invoices
            })
        } catch (error) {
            return next(error);
        }
    },

}