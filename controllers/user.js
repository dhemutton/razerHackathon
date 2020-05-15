const User = require('../models/User');

module.exports = () => {
  var methods = {};

  methods.create = (req, res) => {
    const userData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      nric: req.body.nric,
      credit_score: req.body.credit_score,
      current_account_id: req.body.current_account_id,
      loan_account_id: req.body.loan_account_id,
      fixed_account_id: req.body.fixed_account_id,
      password: req.body.password,
      contact_number: req.body.contact_number,
    };

    methods.findByNric(req.body.nric).then((nric) => {
      if (!nric) {
        User.create(userData)
          .then((user) => {
            res.json(user);
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      } else {
        res.status(400).send('Nric already exists.');
      }
    });
  };

  methods.findByNric = (nric) => {
    return User.findOne({
      where: {
        nric: nric,
      },
    });
  };

  methods.findById = (req, res) => {
    User.findOne({
      where: {
        id: req.query.id,
      },
    })
      .then((result) => res.json(result))
      .catch((err) => res.status(400).send(err));
  };

  methods.retrieveAll = (req, res) => {
    User.findAll().then((result) => {
      res.json(result);
    });
  };

  methods.update = (req, res) => {
    User.update(
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        nric: req.body.nric,
        credit_score: req.body.credit_score,
        current_account_id: req.body.current_account_id,
        loan_account_id: req.body.loan_account_id,
        fixed_account_id: req.body.fixed_account_id,
        password: req.body.password,
        contact_number: req.body.contact_number,
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
    User.findOne({
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
