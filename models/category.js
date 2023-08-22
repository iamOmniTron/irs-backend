


module.exports = (sequelize,DataTypes)=>{
    const Category = sequelize.define("Category",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        name:DataTypes.STRING,
        title:DataTypes.STRING
    },{
        sequelize,freezeTableName:true,timestamps:true
    });


    return Category;
}