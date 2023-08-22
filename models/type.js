

module.exports = (sequelize,DataTypes)=>{
    const Type = sequelize.define("Type",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        name:DataTypes.STRING,
        title:DataTypes.STRING
    },{
        sequelize,freezeTableName:true,timestamps:true
    });
 
    return Type;
}