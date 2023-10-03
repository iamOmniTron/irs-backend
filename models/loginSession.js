



module.exports = (sequelize,DataTypes)=>{
    const Login = sequelize.define("Login",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        time:DataTypes.DATE,
        isAdmin:DataTypes.BOOLEAN
    },{
        sequelize,freezeTableName:true,timestamps:true
    });


    Login.associate = (models)=>{
        Login.belongsTo(models.User);
    }

    return Login;
}