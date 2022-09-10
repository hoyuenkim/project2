module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      checked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    }
  );
  Product.associate = (db) => {
    db.Product.belongsTo(db.Shop);
    db.Product.belongsTo(db.Category);
    db.Product.hasMany(db.Image);
    db.Product.hasMany(db.Comment);
    // db.Product.hasOne(db.Discount);
    db.Product.hasMany(db.Like);
    db.Product.hasMany(db.Payments);
    db.Product.hasMany(db.Rating);
    db.Product.hasMany(db.Stock);
  };
  return Product;
};
