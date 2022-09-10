module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  );
  Category.associate = (db) => {
    db.Category.belongsTo(db.Shop);
    db.Category.hasMany(db.Product);
  };
  return Category;
};
