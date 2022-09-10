const express = require('express');
const router = express.Router();
const db = require('../models');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const Op = require('sequelize').Op;

const uploadDir = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, `product_${Date.now()}.${file.mimetype.split('/')[1]}`);
  },
  destination: (req, file, callback) => {
    callback(null, 'uploads/');
  },
});

const upload = multer({ storage });

router.post('/add', upload.array('files'), async (req, res, next) => {
  try {
    const product = await db.Product.create({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      CategoryId: req.body.CategoryId,
      ShopId: req.body.ShopId,
    });

    const images = await Promise.all(
      req.files.map((file) => {
        return db.Image.create({ url: file.filename });
      })
    );
    await product.addImages(images);
    const finalProduct = await db.Product.findOne({
      where: { id: product.id },
      include: [
        { model: db.Shop, attributes: ['id', 'name'] },
        { model: db.Image, attributes: ['id', 'url'] },
        { model: db.Rating, attributes: ['rate'] },
        { model: db.Comment },
        { model: db.Discount, attributes: ['rate', 'due'] },
        { model: db.Category, attributes: ['id', 'name'] },
      ],
    });
    return res.status(200).json(finalProduct);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post('/edit', upload.array('files'), async (req, res, next) => {
  try {
    await db.Product.update(
      {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        CategoryId: req.body.CategoryId,
      },
      { where: { id: req.body.id } }
    );
    const product = await db.Product.findOne({
      where: { id: req.body.id },
      include: [{ model: db.Image, attributes: ['id', 'url'] }],
    });

    const ImageIds = req.body.ImageIds;

    if (typeof ImageIds === 'object' && ImageIds.length > 0) {
      const values = await product.Images.filter(
        (a) =>
          !ImageIds.some((v) => {
            return a.id == v;
          })
      );
      db.Image.destroy({
        where: {
          [Op.or]: values,
        },
      });
    } else if (ImageIds === undefined) {
      await db.Image.destroy({ where: { ProductId: product.id } });
    } else {
      const values = await product.Images.filter((a) => {
        console.log(typeof a.id, typeof ImageIds);
        return a.id != ImageIds;
      });
      db.Image.destroy({
        where: {
          [Op.or]: values,
        },
      });
    }

    const images = await Promise.all(
      req.files.map((file) => {
        return db.Image.create({ url: file.filename });
      })
    );
    await product.addImages(images);
    const editedProduct = await db.Product.findOne({
      where: { id: req.body.id },
      include: [
        { model: db.Shop, attributes: ['id', 'name'] },
        { model: db.Image, attributes: ['id', 'url'] },
        { model: db.Rating, attributes: ['rate'] },
        { model: db.Comment },
        { model: db.Discount, attributes: ['rate', 'due'] },
        { model: db.Category, attributes: ['id', 'name'] },
      ],
    });
    return res.status(200).json(editedProduct);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post('/delete', async (req, res, next) => {
  try {
    await db.Product.destroy({ where: { id: req.body.id } });
    return res.status(200).json({ id: req.body.id });
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post('/load', async (req, res, next) => {
  try {
    console.log(req.body.ShopId);
    const products = await db.Product.findAll({
      where: { ShopId: req.body.ShopId },
      include: [
        { model: db.Shop, attributes: ['id', 'name'] },
        { model: db.Image, attributes: ['id', 'url'] },
        { model: db.Rating, attributes: ['rate'] },
        { model: db.Comment },
        // { model: db.Discount, attributes: ['rate', 'due'] },
        { model: db.Category, attributes: ['id', 'name'] },
      ],
      order: [['id', 'DESC']],
    });

    const categories = await db.Category.findAll({
      where: { ShopId: req.body.ShopId },
    });

    const result = [products, categories];

    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post('/discount', async (req, res, next) => {
  try {
    console.log(req.body);
    const ProductIds = req.body.ProductIds.map((v) => {
      return { ProductId: v.ProductId };
    });
    await db.Discount.destroy({ where: { [Op.or]: ProductIds } });
    await Promise.all(
      await req.body.ProductIds.map((v) => {
        return db.Discount.create({
          ProductId: v.ProductId,
          rate: req.body.rate,
        });
      })
    );
    const Products = await db.Product.findAll({
      where: { ShopId: req.body.ShopId },
      include: [
        { model: db.Shop, attributes: ['id', 'name'] },
        { model: db.Image, attributes: ['id', 'url'] },
        { model: db.Rating, attributes: ['rate'] },
        { model: db.Comment },
        { model: db.Discount, attributes: ['id', 'rate'] },
        { model: db.Category, attributes: ['id', 'name'] },
      ],
      order: [['id', 'DESC']],
    });
    return res.status(200).json([Products, req.body.CategoryId]);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post('/category/add', async (req, res, next) => {
  try {
    const category = await db.Category.create({
      name: req.body.name,
      ShopId: req.body.ShopId,
    });
    return res.status(200).json(category);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post('/category/load', async (req, res, next) => {
  try {
    const categories = await db.Category.findAll({
      where: { ShopId: req.body.ShopId },
    });
    return res.status(200).json(categories);
  } catch (e) {}
});

router.post('/category/update', async (req, res, next) => {
  console.log(req.body.id);
  try {
    await db.Category.update(
      { name: req.body.name },
      { where: { id: req.body.id } }
    );
    const category = await db.Category.findOne({ where: { id: req.body.id } });
    console.log(category);
    return res.status(200).json(category);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post('/category/delete', async (req, res, next) => {
  try {
    await db.Product.destroy({ where: { CategoryId: req.body.id } });
    await db.Category.destroy({ where: { id: req.body.id } });
    return res.status(200).json({ id: req.body.id });
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post('/discount/delete', async (req, res, next) => {
  try {
    await db.Discount.destroy({ where: { [Op.or]: req.body.ProductIds } });
    const result = await db.Product.findAll({
      where: { ShopId: req.body.ShopId },
      include: [
        { model: db.Shop, attributes: ['id', 'name'] },
        { model: db.Image, attributes: ['id', 'url'] },
        { model: db.Rating, attributes: ['rate'] },
        { model: db.Comment },
        { model: db.Discount, attributes: ['id', 'rate'] },
        { model: db.Category, attributes: ['id', 'name'] },
      ],
      order: [['id', 'DESC']],
    });
    return res.status(200).json([result, req.body.CategoryId]);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;
