const {
  internalErrorText,
} = require('../utils/constants.js');

const errorsMid = (err, req, res, next) => {
  const { status = 500, message } = err;

  res.status(status)
    .send({
      message: status === 500
        ? internalErrorText
        : message,
    });

  next();
};

module.exports = errorsMid;
