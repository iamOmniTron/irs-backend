



module.exports = (sequelize,DataTypes)=>{
    const Login = sequelize.define("Login",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        time:DataTypes.DATE
    },{
        sequelize,freezeTableName:true,timestamps:true
    });


    Login.associates = (models)=>{
        Login.belongsTo(models.User);
    }
}