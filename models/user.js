
module.exports = (sequelize,DataTypes)=>{
    const User = sequelize.define("User",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        firstname:DataTypes.STRING,
        tin:DataTypes.STRING,
        lastname:DataTypes.STRING,
        email:DataTypes.STRING,
        phone:DataTypes.STRING,
        address:DataTypes.STRING,
        homeTown:DataTypes.STRING,
        password:DataTypes.STRING,
        gender:DataTypes.STRING
    });



    User.associate = (models)=>{
        User.hasOne(models.Business);
    }

    return User;
}