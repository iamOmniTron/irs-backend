

module.exports = (sequelize,DataTypes)=>{
    const Type = sequelize.define("Type",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        value:DataTypes.STRING,
        title:DataTypes.STRING
    },{
        sequelize,freezeTableName:true,timestamps:true
    });


    Type.associate = (models)=>{
        Type.hasMany(models.Business)
    }
 
    return Type;
}