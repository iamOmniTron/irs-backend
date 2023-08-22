


module.exports = (sequelize,DataTypes)=>{
    const LocalGovernmentArea = sequelize.define("LocalGovernmentArea",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        name:DataTypes.STRING,
    },{
        sequelize,freezeTableName:true,timestamps:true
    });


    LocalGovernmentArea.associate = (models)=>{
        LocalGovernmentArea.belongsTo(models.District);
        LocalGovernmentArea.hasMany(models.Business);
    }

    return LocalGovernmentArea;
}