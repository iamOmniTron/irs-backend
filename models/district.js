


module.exports = (sequelize,DataTypes)=>{
    const District = sequelize.define("District",{
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


    District.associate = (models)=>{
        District.hasMany(models.LocalGovernmentArea);
    }


    return District;
}