const articleRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles.js');

articleRouter.get('/', getArticles);

articleRouter.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    image: Joi.string().required(),
    link: Joi.string().required(),
  }),
}), createArticle);

articleRouter.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().hex(),
  }),
}), deleteArticle);

module.exports = articleRouter;
