


module.exports = (sequelize,DataTypes)=>{
    const Admin = sequelize.define("Admin",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        userId:DataTypes.STRING,
        phone:DataTypes.STRING,
        email:DataTypes.STRING,
        password:DataTypes.STRING,
        otpCode:DataTypes.INTEGER,
        otpExpiration:DataTypes.STRING
    },{
        sequelize,freezeTableName:true,timestamps:true
    });


    return Admin;
}