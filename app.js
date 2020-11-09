require('dotenv').config();

const express = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { userRouter, articleRouter } = require('./routes/index.js');
const auth = require('./middlewares/auth.js');
const errorsMid = require('./middlewares/errorsMid.js');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');
const { createUser, login } = require('./controllers/users.js');
const NotFoundError = require('./errors/NotFoundError.js');
const { notFoundText } = require('./utils/constants');
const { DB_CONNECT } = require('./utils/config.js');
const { limiter } = require('./middlewares/limiter.js');

const app = express();
const { PORT = 3000, NODE_ENV, DB_CONNECT_PROD } = process.env;

mongoose.connect(NODE_ENV === 'production' ? DB_CONNECT_PROD : DB_CONNECT, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(limiter);

app.use(helmet(
  { contentSecurityPolicy: false },
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

const allowedCors = [
  'https://tvaa.students.nomoreparties.xyz',
  'http://tvaa.students.nomoreparties.xyz',
  'https://www.tvaa.students.nomoreparties.xyz',
  'http://www.tvaa.students.nomoreparties.xyz',
  'https://api.tvaa.students.nomoreparties.xyz',
  'http://api.tvaa.students.nomoreparties.xyz',
  'https://api.www.tvaa.students.nomoreparties.xyz',
  'http://api.www.tvaa.students.nomoreparties.xyz',
  undefined,
];

const corsOptions = {
  origin(origin, callback) {
    if (allowedCors.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new NotFoundError(notFoundText));
    }
  },
};

app.use(cors(corsOptions));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2),
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(auth);
app.use('/users/', userRouter);
app.use('/articles/', articleRouter);

app.use(errorLogger);
app.use(errors());

app.use(errorsMid);

app.listen(PORT, () => {
});
