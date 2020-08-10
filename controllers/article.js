const article = require('../models/article');
const NotFound = require('../errors/notfound');

module.exports.getArticles = (req, res, next) => {
  article
    .find({ owner: req.user._id })
    .then((articles) => res.status(200).send({ data: articles }))
    .catch(next);
};
module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  article
    .create({
      keyword, title, text, date, source, link, image, owner: req.user._id,
    })
    .then((articles) => res.status(200).send({ data: articles }))
    .catch(next);
};
module.exports.deleteArticle = (req, res, next) => {
  article
    .findOne({ _id: req.params.articleId }).orFail(new NotFound('Нет такой новости'))
    .then(async (artclobj) => {
      await artclobj.remove();
      return res.status(200).send({ message: 'Новость удалена' });
    })
    .catch(next);
};
