


module.exports = (sequelize,DataTypes)=>{
    const Category = sequelize.define("Category",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        value:DataTypes.STRING,
        title:DataTypes.STRING
    },{
        sequelize,freezeTableName:true,timestamps:true
    });

    Category.associate = (models)=>{
        Category.hasMany(models.Business)
    }


    return Category;
}