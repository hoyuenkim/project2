module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    'Likes',
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

  Like.associate = (db) => {
    db.Like.belongsTo(db.Product);
    db.Like.belongsTo(db.Comment);
    db.Like.belongsTo(db.Shop);
  };
  return Like;
};
