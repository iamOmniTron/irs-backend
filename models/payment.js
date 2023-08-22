



module.exports = (sequelize,DataTypes)=>{
    const Payment = sequelize.define("Payment",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        amount:DataTypes.DECIMAL(10,2)
    },{
        sequelize,freezeTableName:true,timestamps:true
    });



    Payment.associate = (models)=>{
        Payment.belongsTo(models.Invoice);
    }

    return Payment;
}