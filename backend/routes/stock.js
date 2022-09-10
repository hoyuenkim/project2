const router = require('express').Router();
require('dotenv').config();
const db = require('../models');
const CoordinateModel = require('../mongoModels/coordinates');
const { Op } = require('sequelize');
const moment = require('moment');

router.post('/load', async (req, res, next) => {
  try {
    const stocks = await db.Stock.findAll({
      where: {
        [Op.and]: [
          { ShopId: req.body.ShopId },
          { dueDate: { [Op.gte]: new Date() } },
        ],
      },
      include: [
        { model: db.Shop, attributes: ['id', 'name'] },
        {
          model: db.Product,
          include: [
            { model: db.Image },
            { model: db.Comment },
            { model: db.Rating, attributes: ['rate'] },
            { model: db.Category, attributes: ['id', 'name'] },
          ],
        },
      ],
      order: [['id', 'DESC']],
    });

    const categories = await db.Category.findAll({
      where: { ShopId: req.body.ShopId },
    });

    const result = { stocks, categories };

    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;
