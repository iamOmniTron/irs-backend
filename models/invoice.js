


module.exports = (sequelize,DataTypes)=>{
    const Invoice = sequelize.define("Invoice",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        status:DataTypes.STRING,
    },{
        sequelize,freezeTableName:true,timestamps:true
    })

    Invoice.associate = (models)=>{
        Invoice.hasMany(models.Payment);
    }

    return Invoice;
}