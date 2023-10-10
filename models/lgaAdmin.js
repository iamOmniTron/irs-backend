




module.exports = (sequelize,DataTypes)=>{
    const LgaAdmin = sequelize.define("LgaAdmin",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        firstname:DataTypes.STRING,
        lastname:DataTypes.STRING,
        email:DataTypes.STRING,
        phone:DataTypes.STRING,
        otpCode:DataTypes.INTEGER,
        otpExpiration:DataTypes.INTEGER
    },{
        sequelize,freezeTableName:true,timestamps:true
    })


    LgaAdmin.associate = (models)=>{
        LgaAdmin.belongsTo(models.LocalGovernmentArea);
    }

    return LgaAdmin;
}