module.exports = (sequelize, dataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      content: {
        type: dataTypes.STRING,
        allowNull: false,
      },
    },
    {
      charset: "utf8",
      colloate: "utf8_general_ci",
    },
  );

  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Product);
    db.Comment.belongsTo(db.Shop);
    db.Comment.hasMany(db.Like);
  };

  return Comment;
};
