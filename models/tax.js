


module.exports = (sequelize,DataTypes)=>{
    const Tax = sequelize.define("Tax",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        name:DataTypes.STRING,
        percentage:DataTypes.DECIMAL(10,2),
    },{
        sequelize,timestamps:true,freezeTableName:true
    });


    Tax.associate = (models)=>{
        Tax.belongsTo(models.GrossTurnOver);
        Tax.hasMany(models.Business);
    }

    return Tax;
}