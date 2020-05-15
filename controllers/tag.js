const Tag = require('../models/Tag');

module.exports = () => {
  var methods = {};

  methods.create = (req, res) => {
    const tagData = {
      title: req.body.title,
      budget: req.body.budget,
    };

    Tag.create(tagData)
      .then((tag) => {
        res.json(tag);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  };

  methods.findById = (req, res) => {
    Tag.findOne({
      where: {
        id: req.query.id,
      },
    })
      .then((result) => res.json(result))
      .catch((err) => res.status(400).send(err));
  };

  methods.retrieveAll = (req, res) => {
    Tag.findAll().then((result) => {
      res.json(result);
    });
  };

  methods.update = (req, res) => {
    Tag.update(
      {
        title: req.body.title,
        budget: req.body.budget,
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
    Tag.findOne({
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
