

module.exports = (sequelize,DataTypes)=>{

    const BillingDuration = sequelize.define("BillingDuration",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        duration:DataTypes.STRING,
        title:DataTypes.STRING
    },{
        sequelize,timestamps:true,freezeTableName:true
    });

    BillingDuration.associate =(models)=>{
        BillingDuration.hasMany(models.Business);
    }

    return BillingDuration;
}