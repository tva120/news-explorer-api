const userRouter = require('express').Router();
const { getUser, getUsers } = require('../controllers/users.js');

userRouter.get('/', getUsers);
userRouter.get('/me', getUser);

module.exports = userRouter;
