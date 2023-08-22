const db = require("./models");
const { hashPassword } = require("./utilities/helpers");

const {sequelize} = db;

const seedBillingDuration = async () =>{
    const durations = [
        {
            duration:"WEEKLY",
            title:"BILLED WEEKLY"
        },
        {
            duration:"MONTHLY",
            title:"BILLED MONTHLY"
        },
        {
            duration:"QUATERLY",
            title:"BILLED QUATERLY"
        },
        {
            duration:"BI-ANNUALLY",
            title:"BILLED BI-ANNUALLY"
        },
        {
            duration:"ANNUALLY",
            title:"BILLED ANNUALLY"
        },
    ];
    const t = await sequelize.transaction();

    try {       
        // await db.BillingDuration.drop({transaction:t});
        await db.BillingDuration.bulkCreate(durations,{transaction:t});
        await t.commit();
    } catch (error) {
        console.log(error);
        await t.rollback();
    }
}


const seedGTOConfiguration = async ()=>{
    const turnOvers = [
        {
            title:"Below ₦5,000,000",
            value:"Less Than ₦5,000,000"
        },
        {
            title:"Above ₦5,000,000 and Below ₦25,000,000",
            value:"More Than ₦5,000,000 but Less Than ₦25,000,000"
        },
        {
            title:"Above ₦5,000,000",
            value:"More Than ₦5,000,000"
        },
    ]
    const t = await sequelize.transaction();
    try {
        await db.GrossTurnOver.bulkCreate(turnOvers);
        await t.commit();
    } catch (error) {
        console.log(error);
        await t.rollback();
    }
}


module.exports = async()=>{
    try{
        console.log("Authenticating Database.../n")
        await sequelize.authenticate();
        console.log("Authenticated successfull, Awaiting connection.../n");
        await sequelize.sync();
        console.log("Database Connected successfully...")
        const pass = await hashPassword("12345678")
        await db.Admin.findOrCreate({where:{userId:"administrator"},defaults:{userId:"administrator",password:pass}});
        // await seedBillingDuration();
        // await seedGTOConfiguration();
    }catch(err){
        console.log(err);
        throw new Error(err?.message??"Database Error")
    }
}