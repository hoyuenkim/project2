module.exports = (sequelize, DataTypes) => {
  const Iamport = sequelize.define(
    'Iamport',
    {
      imp_uid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pay_method: DataTypes.STRING,
      merchant_uid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: DataTypes.STRING,
      paid_amount: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      currency: DataTypes.STRING,
      pg_provider: DataTypes.STRING,
      pg_type: DataTypes.STRING,
      pg_tid: DataTypes.STRING,
      apply_num: DataTypes.STRING,
      buyer_name: DataTypes.STRING,
      buyer_email: DataTypes.STRING,
      buyer_tel: DataTypes.STRING,
      buyer_addr: DataTypes.STRING,
      buyer_postcode: DataTypes.STRING,
      custom_data: DataTypes.STRING,
      status: DataTypes.STRING,
      paid_at: DataTypes.DATE,
      receipt_url: DataTypes.STRING,
      card_name: DataTypes.STRING,
      bank_name: DataTypes.STRING,
      card_quota: DataTypes.INTEGER,
      card_number: DataTypes.STRING,
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  );
  Iamport.associate = (db) => {
    db.Iamport.hasMany(db.Payments);
  };
  return Iamport;
};
