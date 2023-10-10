


module.exports = (sequelize,DataTypes)=>{
    const LocalGovernmentArea = sequelize.define("LocalGovernmentArea",{
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


    LocalGovernmentArea.associate = (models)=>{
        LocalGovernmentArea.belongsTo(models.District);
        LocalGovernmentArea.hasMany(models.Business);
        LocalGovernmentArea.hasOne(models.LgaAdmin)
    }

    return LocalGovernmentArea;
}