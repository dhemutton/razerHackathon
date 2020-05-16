const Document = require('../models/Document');

module.exports = () => {
  var methods = {};

  methods.create = (req, res) => {
    const documentData = {
      title: req.body.title,
      file_path: req.body.file_path,
      user_id: req.body.user_id,

    };

    Document.create(documentData)
      .then((document) => {
        document.setUser(documentData.user_id);
        res.json(document);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  };

  methods.findById = (req, res) => {
    Document.findOne({
      where: {
        id: req.query.id,
      },
    })
      .then((result) => res.json(result))
      .catch((err) => res.status(400).send(err));
  };

  methods.retrieveAllDocumentsForUser = (req, res) => {
    Document.findAll({
      where: {
        userId: req.query.id,
      },
    }).then((result) => {
      res.json(result);
    });
  };

  methods.retrieveAll = (req, res) => {
    Document.findAll().then((result) => {
      res.json(result);
    });
  };

  methods.update = (req, res) => {
    Document.update(
      {
        title: req.body.title,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    )
      .then(() => {
        res.json(req.body);
      })
      .catch((err) => res.status(400).send(err));
  };

  methods.deleteById = (req, res) => {
    Document.findOne({
      where: {
        id: req.query.id,
      },
    })
      .then((result) => {
        if (result) {
          result.destroy();
          res.json(result);
        }
      })
      .catch((err) => res.status(400).send(err));
  };

  return methods;
};
