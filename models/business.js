

module.exports = (sequelize,DataTypes)=>{
    const Business = sequelize.define("Business",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        name:DataTypes.STRING,
        address:DataTypes.STRING,
        establishment:DataTypes.DATEONLY,
        isRegistered:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        annualTurnOver:DataTypes.INTEGER,
        lastPaymentDate:DataTypes.DATEONLY,
        nextPaymentDate:{
            type:DataTypes.DATEONLY,
            defaultValue:DataTypes.NOW
        }
    },
    {
        sequelize,freezeTableName:true,timestamps:true
    });

    Business.associate = (models)=>{
        Business.belongsTo(models.Tax);
        Business.belongsTo(models.User);
        Business.belongsTo(models.LocalGovernmentArea);
        Business.belongsTo(models.BillingDuration);
        Business.hasMany(models.Invoice)
        Business.belongsTo(models.Size);
        Business.belongsTo(models.Category);
        Business.belongsTo(models.Type);
    }

    return Business;
}