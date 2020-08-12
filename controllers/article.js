const article = require('../models/article');
const NotFound = require('../errors/notfound');
const Forbidden = require('../errors/forbidden');
const BadRequest = require('../errors/badrequest');

module.exports.getArticles = (req, res, next) => {
  article
    .find({ owner: req.user._id })
    .then((articles) => res.send({ data: articles }))
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
    .then((articles) => res.send({ data: articles }))
    .catch((err) => next(new BadRequest(err.message)));
};
module.exports.deleteArticle = (req, res, next) => {
  article
    .findOne({ _id: req.params.articleId }).select('owner').orFail(new NotFound('Нет такой новости'))
    .then(async (artclobj) => {
      if (artclobj.owner.toString() !== req.user._id) {
        throw new Forbidden('Удалять не свои новости нельзя');
      }
      await artclobj.remove();
      return res.send({ message: 'Новость удалена' });
    })
    .catch(next);
};
