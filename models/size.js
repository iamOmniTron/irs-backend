

module.exports = (sequelize,DataTypes)=>{
    const Size = sequelize.define("Size",{
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

    return Size;
}