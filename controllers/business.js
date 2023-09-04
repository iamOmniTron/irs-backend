const db = require("../models");






module.exports = {
    getBusinesses: async (_,res,next)=>{
        try {
            const businesses = await db.Business.findAll({include:[{model:db.Category},{model:db.Type},{model:db.Size},{model:db.BillingDuration},{model:db.User},{model:db.Tax,include:[{model:db.GrossTurnOver}]},{model:db.LocalGovernmentArea}]});
            return res.json({
                success:true,
                data:businesses
            })
        } catch (error) {
            return next(error);
        }
    }
}