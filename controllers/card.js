const Card = require('../models/Card');
var fs = require('fs');
const axios = require('axios');
const https = require('https');

// req.post(
//   { uri: "https://sandbox.api.visa.com/…", 
//   key: fs.readFileSync(keyFile), 
//   cert: fs.readFileSync(certificateFile), 
//   ca: fs.readFileSync(caFile),    
//   headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Basic ' + new Buffer(userId + ':' + password).toString('base64') },
//   body: data }, 
//   function (error, response, body) { … });
//   const options = {
//     key: fs.readFileSync('./../key.pem'),
//     cert: fs.readFileSync('./../cert.pem')
//   };


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
