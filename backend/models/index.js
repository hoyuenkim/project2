const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config')[env];
const db = {};

const Wkt = require('terraformer-wkt-parser');
Sequelize.GEOMETRY.prototype._stringify = function _stringify(value, options) {
  return 'ST_GeomFromText(' + options.escape(Wkt.convert(value)) + ')';
};
Sequelize.GEOGRAPHY.prototype._stringify = function _stringify(value, options) {
  return 'ST_GeomFromText(' + options.escape(Wkt.convert(value)) + ')';
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.User = require('./user')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);
db.Image = require('./image')(sequelize, Sequelize);
db.Category = require('./category')(sequelize, Sequelize);
db.Logs = require('./logs')(sequelize, Sequelize);
db.Product = require('./product')(sequelize, Sequelize);
db.Shop = require('./shop')(sequelize, Sequelize);
db.Like = require('./like')(sequelize, Sequelize);
db.Payments = require('./payments')(sequelize, Sequelize);
db.Iamport = require('./iamport')(sequelize, Sequelize);
db.Rating = require('./rating')(sequelize, Sequelize);
db.Stock = require('./stock')(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
