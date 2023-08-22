
module.exports = (sequelize,DataTypes)=>{
    const User = sequelize.define("User",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        firstname:DataTypes.STRING,
        lastname:DataTypes.STRING,
        email:DataTypes.STRING,
        phone:DataTypes.STRING,
        stateOfOrigin:DataTypes.STRING,
        lga:DataTypes.STRING,
        password:DataTypes.STRING,
        gender:DataTypes.STRING
    });



    User.associate = (models)=>{
        User.hasOne(models.Business);
    }

    return User;
}