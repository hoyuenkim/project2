const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const expressSession = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const http = require('http');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
const sequelize = require('sequelize');
const Op = sequelize.Op;
// const schedule = require('node-schedule');
// const SocketIo = require("./socket");

const passportConfig = require('./passport');
const db = require('./models');

const CoordinateModel = require('./mongoModels/coordinates');

const products = require('./routes/products');
const user = require('./routes/user');
// const menu = require('./routes/menu');
const payments = require('./routes/payments');
const shop = require('./routes/shop');
const stock = require('./routes/stock');

dotenv.config();
const app = express();
db.sequelize.sync().then(() => {
  console.log('Mysql is connected');
});

mongoose.connect(`mongodb://localhost:27017/project1`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const mongodb = mongoose.connection;

mongodb.once('open', () => {
  console.log('mongodb is connected');
});

mongodb.on('error', (err) => {
  console.error(err);
});

app.use(morgan('dev'));
app.use('/uploads', express.static('./uploads'));
app.use(
  cors({
    origin: true,
  })
);

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
passportConfig();

app.use('/products', products);
app.use('/user', user);
app.use('/payments', payments);
app.use('/shop', shop);
app.use('/stock', stock);

const options = {
  key: fs.readFileSync(__dirname + '/key.pem', 'utf-8'),
  cert: fs.readFileSync(__dirname + '/cert.pem', 'utf-8'),
};

const OneSignal = require('onesignal-node');
const client = new OneSignal.Client(
  process.env.ONESIGNAL_KEY,
  process.env.ONESIGNAL_SECRET
);

const notification = {
  contents: {
    tr: 'hoyuen.kim',
    en: 'success',
  },
  included_segments: ['Subscribed Users'],
};

app.get('/onesignal', async (req, res, next) => {
  try {
    const response = await client.createNotification(notification);
    return res.status(200).send('success');
  } catch (err) {
    console.error(err);
    next(err);
  }
});

const httpServer = http.createServer(app).listen(3020);

const httpsServer = https.createServer(options, app).listen(3075, () => {
  console.log(`The server is running on 3075 port`);
});

// SocketIo(httpsServer, app);
