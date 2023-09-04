

module.exports = (sequelize,DataTypes)=>{
    const Size = sequelize.define("Size",{
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

    Size.associate = (models)=>{
        Size.hasMany(models.Business)
    }

    return Size;
}