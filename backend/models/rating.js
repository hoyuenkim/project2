module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    'Ratings',
    {
      rate: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      chatset: 'utf8',
      collate: 'utf8_general_ci',
    },
  );

  Rating.associate = (db) => {
    db.Rating.belongsTo(db.Product);
    db.Rating.belongsTo(db.Payments);
    db.Rating.belongsTo(db.User);
  };
  return Rating;
};
