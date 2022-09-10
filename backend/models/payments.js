module.exports = (sequelize, DataTypes) => {
  const Payments = sequelize.define(
    "Payments",
    {
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      imp_uid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      merchant_uid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      UserName: DataTypes.STRING,
      ProductTitle: DataTypes.STRING,
      ShopName: DataTypes.STRING,
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
    },
  );
  Payments.associate = (db) => {
    db.Payments.belongsTo(db.Product);
    db.Payments.belongsTo(db.Shop);
    db.Payments.belongsTo(db.User);
    db.Payments.belongsTo(db.Iamport);
    db.Payments.hasOne(db.Rating);
    db.Payments.belongsTo(db.Stock);
  };
  return Payments;
};
