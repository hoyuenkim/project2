module.exports = (sequelize, dataTypes) => {
  const Image = sequelize.define(
    "Image",
    {
      url: {
        type: dataTypes.STRING,
        allowNull: false,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  Image.associate = (db) => {
    db.Image.belongsTo(db.Product);
  };
  return Image;
};
