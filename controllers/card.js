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
          "pan": process.env.VISA_PAN3,
          "lookUpBalances": true
        }
      ]
    }

    visaInstance.post(`/cards`, test)
      .then((visaRes) => {
        res.json(visaRes.data.resource.cards[0].cardId);
      }).catch((err) => {
        res.status(400).send(err.message);
      });
  }

  methods.getCardTransactionHistory = (req, res) => {
    visaInstance.get(`/cards/${req.body.card_number}/transactions`)
      .then((visaRes) => {
        res.json(visaRes.data.resource);
      })
      .catch((err) => res.status(400).send(err));
  }

  methods.create = (req, res) => {
    const cardData = {
      card_number: req.body.card_number,
      user_id: req.body.user_id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      expiry_date: req.body.expiry_date,

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
