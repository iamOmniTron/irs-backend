

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
        annualTurnOver:DataTypes.INTEGER
    },
    {
        sequelize,freezeTableName:true,timestamps:true
    });

    Business.associate = (models)=>{
        Business.belongsTo(models.Tax);
        Business.belongsTo(models.User);
        Business.belongsTo(models.LocalGovernmentArea);
        Business.belongsTo(models.BillingDuration);
    }

    return Business;
}