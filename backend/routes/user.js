const express = require('express');
const router = express.Router();
const db = require('../models');
const multer = require('multer');
const path = require('path');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
const CoordinateModel = require('../mongoModels/coordinates');
require('dotenv').config();

const uploadDir = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
  destination(req, file, done) {
    done(null, uploadDir);
  },
  filename(req, file, done) {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    done(null, basename + new Date().valueOf() + ext);
  },
});

const upload = multer({ storage, limit: { fileSize: 20 * 1024 * 1024 } });

router.post('/signup', async (req, res, next) => {
  try {
    const mailConfig = {
      service: 'Naver',
      host: 'smtp.naver.com',
      port: 587,
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    };
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const certificate = randomstring.generate({
      length: 40,
    });

    const user = await db.User.create({
      username: req.body.username,
      password: hashedPassword,
      name: req.body.name,
      division: 1,
      address: req.body.address,
      addressDetail: req.body.addressDetail,
      certificate,
      lat: req.body.coordinates[1],
      lng: req.body.coordinates[0],
    });
    console.log(user);

    let transporter = nodemailer.createTransport(mailConfig);
    console.log(transporter);
    if (user && transporter) {
      let message = {
        from: process.env.MAIL_EMAIL,
        to: req.body.username,
        subject: '이메일 인증 요청 메일입니다.',
        html: `
        <body>
        <p>하기 링크를 클릭하여 이메일 인증을 완성해주세요</p>
        <a href=${process.env.BACKEND_IP}/user/certificate/${certificate}>
        ${process.env.BACKEND_IP}/user/certificate/${certificate}</a>
        </body>`,
      };
      const result = await transporter.sendMail(message);
      console.log(result);
    }
    const shop = await db.Shop.create({
      name: req.body.shopName,
      bizcode: req.body.bizcode,
      address: req.body.address,
      addressDetail: req.body.addressDetail,
      lat: req.body.coordinates[1],
      lng: req.body.coordinates[0],
    });
    await CoordinateModel.create({
      ShopId: shop.id,
      username: user.username,
      division: user.division,
      name: shop.name,
      location: {
        type: 'Point',
        coordinates: req.body.coordinates,
      },
    });
    user.addShop(shop);
    return res.status(200).send(true);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.post('/login', (req, res, next) => {
  try {
    console.log(req.body);
    passport.authenticate('local', (passportError, user, info) => {
      if (passportError || !user) {
        res.status(401).json(info.reason);
        return;
      }

      req.login(user, { session: false }, async (loginError) => {
        if (loginError) {
          return res.send(loginError);
        }

        const fullUser = await db.User.findOne({
          where: { id: user.id },
          include: [
            {
              model: db.Shop,
              attributes: [
                'id',
                'name',
                'lat',
                'lng',
                'address',
                'addressDetail',
              ],
            },
          ],
          attributes: ['id', 'name', 'username', 'division', 'lat', 'lng'],
        });
        const userObject = JSON.parse(JSON.stringify(fullUser));
        const token = jwt.sign(userObject, process.env.JWT_SECRETKEY);
        return res.status(200).json({ fullUser, token });
      });
    })(req, res, next);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/certificate/:certificate', async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: { certificate: req.params.certificate },
    });
    if (user) {
      await db.User.update(
        { authorized: true },
        { where: { certificate: req.params.certificate } }
      );
    } else {
      throw new Error('No user');
      return next();
    }
    return res.status(200).redirect(process.env.FRONTEND_IP);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/confirm/bizcode', async (req, res, next) => {
  try {
    const result = await db.Shop.findOne({
      where: { bizcode: req.body.bizcode },
    });
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/confirm/email', async (req, res, next) => {
  try {
    const result = await db.User.findOne({
      where: { username: req.body.email },
    });
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/confirm/password', async (req, res) => {
  try {
    const user = await db.User.findOne({ where: { id: req.body.id } });
    const result = await bcrypt.compare(req.body.password, user.password);
    return res.status(200).send(result);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.post('/password/change', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await db.User.update(
      { password: hashedPassword },
      { where: { id: req.body.id } }
    );
    return res.status(200).send('Password changed');
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/password/find', async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: { username: req.body.username },
    });
    if (!user) {
      return res.status(401).json({ message: '존재하지 않는 아이디입니다.' });
    }
    const mailConfig = {
      service: 'Naver',
      host: 'smtp.naver.com',
      port: 587,
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    };
    let message = {
      from: process.env.MAIL_EMAIL,
      to: req.body.username,
      subject: '임시비밀번호 입니다.',
      html: `
      <body>
        <p>임시 비밀번호 $${certificate}</p>
      </body>`,
    };
    let transporter = nodemailer.createTransport(mailConfig);
    const result = await transporter.sendMail(message);
    console.log(result);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
