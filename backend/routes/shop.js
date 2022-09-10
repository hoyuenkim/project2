const express = require("express");
const router = express.Router();
const db = require("../models");
const axios = require("axios");
const CoordinateModel = require("../mongoModels/coordinates");
require("dotenv").config();

router.post("/detail", async (req, res, next) => {
  try {
    const store = await db.Store.findOne({
      where: { id: req.body.id },
      include: [
        {
          model: db.Product,
          include: [
            { model: db.Image, attributes: ["url"] },
            {
              models: db.Category,
              attributes: ["name", "id"],
            },
            { models: db.Discount, attributes: ["rate"] },
          ],
        },
      ],
      attributes: ["name", "address", "addressDetail", "lat", "lng"],
    });
    return res.status(200).json(store);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post("/list", async (req, res, next) => {
  try {
    const ShopList = await db.Shop.findAll({ where: { UserId: req.body.UserId } });
    return res.status(200).json(ShopList);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.post("/add", async (req, res, next) => {
  try {
    const { UserId, coordinates, shopName, address, addressDetail } = req.body;
    const shopData = await db.Shop.findOne({ where: { UserId } });
    const user = await db.User.findOne({ where: { id: UserId } });
    const shop = await db.Shop.create({
      name: shopName,
      bizcode: shopData.bizcode,
      address,
      addressDetail,
      lat: coordinates[0],
      lng: coordinates[1],
    });
    await CoordinateModel.create({
      name: shop.name,
      username: user.name,
      ShopId: shop.id,
      division: true,
      location: { type: "Point", coordinates },
    });
    await user.addShop(shop);
    return res.status(200).json(shop);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/edit", async (req, res, next) => {
  const { id, name, address, address_detail } = req.body;

  try {
    const result = await db.Store.update(
      {
        name,
        address,
        address_detail,
        lnt: point.x,
        lng: point.y,
      },
      { where: { id } },
    );
    const store = db.Store.findOne({
      where: { id: result.id },
      include: [
        {
          model: db.Product,
          include: [
            { model: db.Image, attributes: ["url"] },
            { model: db.Category, attributes: ["name", "id"] },
            { model: db.Discount, attributes: ["rate"] },
          ],
        },
      ],
    });
    return res.status(200).json(store);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;
