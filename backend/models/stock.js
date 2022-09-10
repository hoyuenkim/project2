module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define(
    "Stock",
    {
      quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
      stock: {
        type: DataTypes.INTEGER(),
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATE(),
        allowNull: false,
      },
      discount: {
        type: DataTypes.DOUBLE(),
        allowNull: false,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
    },
  );

  Stock.associate = (db) => {
    db.Stock.belongsTo(db.Product);
    db.Stock.belongsTo(db.Shop);
    db.Stock.hasMany(db.Payments);
    db.Stock.belongsTo(db.User);
  };
  return Stock;
};
