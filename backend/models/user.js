module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      division: {
        type: DataTypes.BOOLEAN(),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(),
        allowNull: false,
      },
      certificate: {
        type: DataTypes.STRING(),
        allowNull: false,
      },
      authorized: {
        type: DataTypes.BOOLEAN(),
        defaultValue: false,
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

  User.associate = (db) => {
    db.User.hasMany(db.Comment);
    db.User.hasMany(db.Shop);
    db.User.hasMany(db.Payments);
    db.User.hasMany(db.Rating);
    db.User.hasMany(db.Stock);
  };

  return User;
};
