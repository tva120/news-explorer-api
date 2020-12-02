const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 900000,
  max: 100,
});

module.exports = { limiter };
