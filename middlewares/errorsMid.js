const {
  internalErrorText,
} = require('../utils/constants.js');

const errorsMid = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  console.log(err);
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? internalErrorText
        : message,
    });

  next();
};

module.exports = errorsMid;
