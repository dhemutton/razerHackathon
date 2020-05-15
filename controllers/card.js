const Card = require('../models/Card');

module.exports = () => {
  var methods = {};

  methods.create = (req, res) => {
    const cardData = {
      card_number: req.body.card_number,
      user_id: req.body.user,
    };

    Card.create(cardData)
      .then((card) => {
        card.setUser(cardData.user_id);
        res.json(card);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  };

  methods.findById = (req, res) => {
    Card.findOne({
      where: {
        id: req.query.id,
      },
    })
      .then((result) => res.json(result))
      .catch((err) => res.status(400).send(err));
  };

  methods.findByUserId = (req, res) => {
    Card.findAll({
      where: {
        userId: req.query.id,
      },
    })
      .then((result) => res.json(result))
      .catch((err) => res.status(400).send(err));
  };

  methods.retrieveAll = (req, res) => {
    Card.findAll().then((result) => {
      res.json(result);
    });
  };

  methods.update = (req, res) => {
    Card.update(
      {
        card_number: req.body.card_number,
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
    Card.findOne({
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
