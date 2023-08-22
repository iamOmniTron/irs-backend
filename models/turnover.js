


module.exports = (sequelize,DataTypes)=>{
    const GrossTurnOver = sequelize.define("GrossTurnOver",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        title:DataTypes.STRING,
        value:DataTypes.STRING,
    },{
        sequelize,freezeTableName:true,timestamps:true
    });

    GrossTurnOver.associate = (models)=>{
        GrossTurnOver.hasOne(models.Tax);
    }

    return GrossTurnOver;
}