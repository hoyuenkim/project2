const express = require('express');
const router = express.Router();
const db = require('../models');
const axios = require('axios');
const sequelize = require('sequelize');
const Op = sequelize.Op;

router.post('/cancel', async (req, res, next) => {
  try {
    let getCancelData;
    if (req.body.division == true) {
      const result = await axios.post('https://api.iamport.kr/users/getToken', {
        imp_key: process.env.IMP_KEY,
        imp_secret: process.env.IMP_SECRET,
      });

      const {
        data: {
          response: { access_token },
        },
      } = result;

      getCancelData = await axios.post(
        'https://api.iamport.kr/payments/cancel',
        {
          reason: '환불요청', // 가맹점 클라이언트로부터 받은 환불사유
          imp_uid: req.body.imp_uid, // imp_uid를 환불 `unique key`로 입력
          amount: req.body.amount, // 가맹점 클라이언트로부터 받은 환불금액
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${access_token}`, // 아임포트 서버로부터 발급받은 엑세스 토큰
          },
        }
      );
    }
    const query = req.body.division == 0 ? { status: 1 } : { status: 2 };
    await db.Payments.update(query, {
      where: { id: req.body.id },
    });
    const payment = await db.Payments.findOne({ where: { id: req.body.id } });
    return res.status(200).json(payment);
  } catch (err) {
    console.log(err);
    console.error(err);
    next(err);
  }
});

router.post('/load', async (req, res, next) => {
  try {
    if (req.body.division == false) {
      const history = await db.Payments.findAll({
        where: { UserId: req.body.id },
        include: [
          {
            model: db.Product,
            include: [{ model: db.Image, attributes: ['url'] }],
          },
          { model: db.Shop, attributes: ['name'] },
          { model: db.Iamport, attributes: ['imp_uid'] },
          { model: db.Rating },
        ],
      });
      return res.status(200).json(history);
    } else {
      const Shop = await db.Shop.findAll({ where: { UserId: req.body.id } });
      const history = await db.Payments.findAll({
        where: { ShopId: Shop[0].id },
        include: [
          {
            model: db.Product,
            include: [{ model: db.Image, attributes: ['url'] }],
          },
          { model: db.Shop, attributes: ['name'] },
          { model: db.User, attributes: ['name'] },
          { model: db.Iamport, attributes: ['imp_uid'] },
          { model: db.Rating },
        ],
      });
      return res.status(200).json(history);
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post('/rating', async (req, res, next) => {
  try {
    const log = await db.Rating.findOne({
      where: { PaymentId: req.body.PaymentsId },
    });
    if (log) {
      await db.Rating.update(
        { rate: req.body.rate },
        { where: { PaymentId: req.body.PaymentsId } }
      );
      const result = await db.Rating.findOne({
        where: { PaymentId: req.body.PaymentsId },
      });
      return res.status(200).json(result);
    }

    const result = await db.Rating.create({
      rate: req.body.rate,
      PaymentId: req.body.PaymentsId,
      UserId: req.body.UserId,
      ProductId: req.body.ProductId,
    });
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return next(e);
  }
});

router.post('/search/user', async (req, res, next) => {
  try {
    const UserId = req.body.data.UserId;
    const textQuery = req.body.data.text
      ? req.body.data.select === 'product'
        ? { ProductTitle: { [Op.like]: `%${req.body.data.text}%` } }
        : { ShopName: { [Op.like]: `%${req.body.data.text}%` } }
      : null;
    const dateQuery =
      req.body.data.startDate && req.body.data.endDate
        ? [
            { createdAt: { [Op.gte]: req.body.data.startDate } },
            { createdAt: { [Op.lte]: req.body.data.endDate } },
          ]
        : [];

    const query = {
      [Op.and]: [textQuery, ...dateQuery, { UserId }],
    };

    const result = await db.Payments.findAll({
      where: query,
      include: [
        {
          model: db.Product,
          include: [{ model: db.Image, attributes: ['url'] }],
        },
        { model: db.User, attributes: ['name'] },
        { model: db.Iamport, attributes: ['imp_uid'] },
        { model: db.Shop, attributes: ['name'] },
      ],
    });
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post('/search/shop', async (req, res, next) => {
  try {
    const ShopId = await db.Shop.findOne({
      where: { UserId: req.body.data.UserId },
    });
    const textQuery = req.body.data.text
      ? req.body.data.select === 'product'
        ? { ProductTitle: { [Op.like]: `%${req.body.data.text}%` } }
        : { UserName: { [Op.like]: `%${req.body.data.text}%` } }
      : null;
    const dateQuery =
      req.body.data.startDate && req.body.data.endDate
        ? [
            { createdAt: { [Op.gte]: req.body.data.startDate } },
            { createdAt: { [Op.lte]: req.body.data.endDate } },
          ]
        : [];

    const query = {
      [Op.and]: [textQuery, ...dateQuery, { ShopId: ShopId.id }],
    };

    const result = await db.Payments.findAll({
      where: query,
      include: [
        {
          model: db.Product,
          include: [{ model: db.Image, attributes: ['url'] }],
        },
        { model: db.User, attributes: ['name'] },
        { model: db.Iamport, attributes: ['imp_uid'] },
        { model: db.Shop, attributes: ['name'] },
      ],
    });
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;
