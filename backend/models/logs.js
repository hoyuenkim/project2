module.exports = (sequelize, DataTypes) => {
  const Logs = sequelize.define(
    "Logs",
    {
      title: {
        type: DataTypes.STRING(),
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER(),
        allowNull: true,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
    },
  );
  Logs.associate = (db) => {
    db.Logs.belongsTo(db.Shop);
    db.Logs.belongsTo(db.User);
  };
  return Logs;
};
