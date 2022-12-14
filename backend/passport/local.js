const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
        session: false,
      },
      async (username, password, done) => {
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
        } catch (e) {
          console.error(e);
          return done(e);
        }
      }
    )
  );
};
