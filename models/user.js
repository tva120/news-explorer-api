const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const AuthorizationError = require('../errors/AuthError');
const {
  authErrorText,
} = require('../utils/constants.js');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(mail) {
        return isEmail(mail);
      },
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError(authErrorText);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorizationError(authErrorText);
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
