module.exports = (sequelize, DataTypes) => {
  const Shop = sequelize.define(
    "Shop",
    {
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      bizcode: {
        type: DataTypes.STRING(),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(),
        allowNull: false,
      },
      addressDetail: {
        type: DataTypes.STRING(),
        allowNull: true,
      },
      lat: {
        type: DataTypes.DOUBLE(),
        allowNull: true,
      },
      lng: {
        type: DataTypes.DOUBLE(),
        allowNull: true,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
    },
  );

  Shop.associate = (db) => {
    db.Shop.hasMany(db.Category);
    db.Shop.hasMany(db.Product);
    db.Shop.hasMany(db.Comment);
    db.Shop.hasMany(db.Like);
    db.Shop.belongsTo(db.User);
    db.Shop.hasMany(db.Payments);
    db.Shop.hasMany(db.Stock);
  };
  return Shop;
};
