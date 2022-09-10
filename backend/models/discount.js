module.exports = (sequelize, DataTypes) => {
  const Discount = sequelize.define(
    'Discount',
    {
      rate: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      due: {
        type: DataTypes.DATE(),
        allowNull: true,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  );
  Discount.associate = (db) => {
    db.Discount.belongsTo(db.Product);
  };
  return Discount;
};
