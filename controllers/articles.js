const Article = require('../models/article');
const NotFoundError = require('../errors/NotFoundError.js');
const BadRequestError = require('../errors/BadRequestError.js');
const RightsError = require('../errors/RightsError.js');
const {
  badRequestErrorText, notFoundErrorText, rightsErrorText, successText,
} = require('../utils/constants.js');

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, image, link,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, image, link, owner: req.user._id,
  })
    .then((item) => res.status(200).send(item))
    .catch(() => {
      next(new BadRequestError(badRequestErrorText));
    });
};

const getArticles = (req, res, next) => Article.find({})
  .then((articles) => res.send(articles))
  .catch(next);

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .catch(() => {
      throw new NotFoundError(notFoundErrorText);
    })
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        throw new RightsError(rightsErrorText);
      }
      Article.deleteOne(article)
        .then(() => {
          res.status(200).send(
            successText,
          );
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = { getArticles, createArticle, deleteArticle };
