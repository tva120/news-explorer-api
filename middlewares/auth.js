const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthError');
const {
  authErrorText,
} = require('../utils/constants.js');

const { NODE_ENV, JWT_SECRET } = process.env;
const { DEV_SECRET } = require('../utils/config');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new AuthorizationError(authErrorText);
  }
  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : DEV_SECRET);
  } catch (e) {
    throw new AuthorizationError(authErrorText);
  }

  req.user = payload;
  next();
};
