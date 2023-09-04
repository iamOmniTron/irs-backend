const db = require("../models");
const { generatePaymentReferenceNumber, ONE_WEEK, ONE_MONTH, THREE_MONTHS, SIX_MONTHS, ONE_YEAR } = require("../utilities/helpers");




module.exports = {
    createReciept: async (req,res,next)=>{
        const t = await db.sequelize.transaction();
        try {
            const {invoiceId} = req.body;
            const invoice = await db.Invoice.findOne({where:{id:invoiceId}});
            if(!invoice) return res.json({
                success:false,
                message:"Invalid Invoice"
            });
            const refNumber = generatePaymentReferenceNumber();
            const newPayment = await db.Payment.create({referenceNumber:refNumber,amount:invoice.amount,InvoiceId:invoiceId},{transaction:t});
            if(!newPayment) return res.json({
                success:false,
                message:"cannot facilitate payment"
            });
            await invoice.update({status:"successful"},{transaction:t});
            const isSaved = await invoice.save({transaction:t});
            if(!isSaved) return res.json({
                success:false,
                message:"cannot continue payment"
            });
            // UPDATE BUSINESS PAYMENT HISTORY
            const business = await db.Business.findOne({where:{id:invoice.BusinessId},include:[{model:db.BillingDuration}]});
            const duration = business.BillingDuration.duration;
            const prevLastPaymentDate = business.nextPaymentDate;
            let time;
            switch (duration) {
                case "WEEKLY":
                    time = ONE_WEEK;
                    break;
                case "MONTH":
                    time = ONE_MONTH;
                    break;
                case "QUATERLY":
                    time = THREE_MONTHS;
                    break;
                case "BI_ANNUALLY":
                    time = SIX_MONTHS;
                    break;
                case "ANNUALLY":
                    time = ONE_YEAR;
                    break;
                default:
                    time = ONE_MONTH;
                    break;
            }
            const nextPaymentDate = new Date((new Date(prevLastPaymentDate).valueOf())+time);
            console.log(nextPaymentDate);
            const isUpdated = await db.Business.update({lastPaymentDate:new Date(Date.now()),
                nextPaymentDate},{where:{id:business.id}})
            if(!isUpdated) return res.json({
                success:false,
                message:"cannot update payment record"
            })
            await t.commit();
            return res.json({
                success:true,
                message:"payment successful"
            })
        } catch (error) {
            await t.rollback();
            return next(error);
        }
    },
    getAllPayments: async(_,res,next)=>{
        try {
            const payments = await db.Payment.findAll({include:[{model:db.Invoice,include:[{model:db.Business,include:[{model:db.User},{model:db.LocalGovernmentArea,include:[{model:db.District}]}]}]}]});
            return res.json({
                success:true,
                data:payments
            })
        } catch (error) {
            return next(error);
        }
    },
    getMyPayments: async (req,res,next)=>{
        try {
            const {userId} = req;
            const payments = await db.Payment.findAll({include:[{model:db.Invoice,required:true,include:[{model:db.Business,where:{UserId:userId}}]}]});
            return res.json({
                success:true,
                data:payments
            })
        } catch (error) {
            return next(error);
        }
    },
    getLGAPayments: async (req,res,next)=>{
        try {
            const {lgaId} = req.params;
            console.log(lgaId)
            const payments = await db.Payment.findAll({include:[{model:db.Invoice,required:true,include:[{model:db.Business,where:{LocalGovernmentAreaId:lgaId},include:[{model:db.User},{model:db.LocalGovernmentArea}]}]}]});


            return res.json({
                success:true,
                data:payments
            })
        } catch (error) {
            return next(error)
        }
    },
    getDistrictPayments: async (req,res,next)=>{
        try {
            const {districtId} = req.params;
            const payments = await db.Payment.findAll({include:[{model:db.Invoice,required:true,include:[{model:db.Business,include:[{model:db.User},{model:db.LocalGovernmentArea,where:{DistrictId:districtId},include:[{model:db.District}]}]}]}]});

            return res.json({
                success:true,
                data:payments
            })
        } catch (error) {
            return next(error)
        }
    },
}