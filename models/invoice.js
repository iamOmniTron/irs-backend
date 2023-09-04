


module.exports = (sequelize,DataTypes)=>{
    const Invoice = sequelize.define("Invoice",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        status:DataTypes.STRING,
        invoiceNumber:DataTypes.STRING,
        amount:DataTypes.INTEGER
    },{
        sequelize,freezeTableName:true,timestamps:true
    })

    Invoice.associate = (models)=>{
        Invoice.hasMany(models.Payment);
        Invoice.belongsTo(models.Business);
    }

    return Invoice;
}