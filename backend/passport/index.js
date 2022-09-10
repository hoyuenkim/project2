const passport = require('passport');
const db = require('../models');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { ExtractJwt, Strategy: JWTStrategy } = require('passport-jwt');
require('dotenv').config();

const passportConfig = {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true,
  session: false,
};

const passportVerify = async (req, username, password, done) => {
  try {
    const user = await db.User.findOne({
      where: { username },
      include: [{ model: db.Shop }],
    });
    if (!user) {
      return done(null, false, { reason: '존재하지 않는 사용자입니다!' });
    }
    if (!user.authorized) {
      return done(null, false, { reason: '메일인증을 실시해주세요.' });
    }
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      return done(null, user);
    }
    return done(null, false, { reason: '비밀번호가 틀립니다.' });
  } catch (err) {
    console.error(err);
    return done(err);
  }
};

const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRETKEY,
};

const JWTVerify = async (jwtPayload, done) => {
  try {
    const user = await db.User.findOne({ where: { id: jwtPayload.id } });
    if (user) {
      return done(null, user);
    }
    return done(null, false, { reason: '올바르지 않은 인증정보입니다.' });
  } catch (err) {
    console.error(err);
    done(err);
  }
};

module.exports = () => {
  passport.use(new LocalStrategy(passportConfig, passportVerify));
  passport.use(new JWTStrategy(JWTConfig, JWTVerify));
};
