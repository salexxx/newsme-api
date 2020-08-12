const articleRout = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { default: validator } = require('validator');
const { getArticles, createArticle, deleteArticle } = require('../controllers/article');

articleRout.get('/', getArticles);

articleRout.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2).max(30),
    date: Joi.string().required().min(2).max(30),
    source: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле link заполненно некорректно');
    }),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле image заполненно некорректно');
    }),
  }),
}), createArticle);

articleRout.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().length(24).hex(),
  }),
}), deleteArticle);
module.exports = articleRout;
