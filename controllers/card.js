const Card = require('../models/Card');
var fs = require('fs');
const axios = require('axios');
const https = require('https');
const visaAuth = {
  username: process.env.VISA_USER,
  password: process.env.VISA_PASS
}
const visahttpsAgent = new https.Agent(
  {
    cert: fs.readFileSync('./cert.pem'),
    ca: fs.readFileSync('./ca.crt'),
    key: fs.readFileSync('./key.pem'),
    keepAlive: true,
  });

const visaInstance = axios.create({
  baseURL: 'https://sandbox.api.visa.com/dcas/cardservices/v1',
  auth: visaAuth,
  httpsAgent: visahttpsAgent
});

module.exports = () => {
  var methods = {};

  methods.generateVisaCard = (req, res) => {
    let test = {
      "cardIdModel": [
        {
          "pan": "4883836336860016",
          "lookUpBalances": true
        }
      ]
    }

    visaInstance.post(`/cards`, test)
      .then((visaRes) => {
        console.log(visaRes)
        res.json(visaRes.data);
      }).catch((err) => {
        res.send(err);
        // res.status(400);
      });
  }

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
