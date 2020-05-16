const User = require('../models/User');
const axios = require('axios');
const mambuAuth = {
  username: process.env.MAMBU_USER,
  password: process.env.MAMBU_PASS
}

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

  methods.endorseUser = (req, res) => {
    User.findOne({
      where: {
        id: req.body.userToEndorse,
      },
    })
      .then((userToEndorse) => {
        //Add endorser to the user's endorsers
        if (!userToEndorse.endorsers.includes(req.body.endorser)) {
          let endorsersArr = userToEndorse.endorsers;
          endorsersArr.push(req.body.endorser);
          userToEndorse.update(
            {
              endorsers: endorsersArr,
            },
          )
            //Add to endorser's endorsed array
            .then(() => {
              User.findOne({
                where: {
                  id: req.body.endorser,
                },
              })
                .then((endorser) => {
                  let endorsedArr = endorser.endorsed;
                  endorsedArr.push(req.body.userToEndorse)
                  endorser.update(
                    {
                      endorsed: endorsedArr,
                    },
                  )
                  res.json({ endorser, userToEndorse });
                }).catch((err) => res.status(400).send(err));
            })
            .catch((err) => res.status(400).send(err));
        } else {
          res.status(400).send('Already endorsed by the user.')
        }
      })
      .catch((err) => res.status(400).send(err));
  };

  methods.removeEndorsement = (req, res) => {
    User.findOne({
      where: {
        id: req.body.userToRemoveEndorsement,
      },
    })
      .then((userToRemoveEndorsement) => {
        //Remove endorser from the user's endorsers
        if (userToRemoveEndorsement.endorsers.includes(req.body.unhappyUser)) {
          let endorsersArr = userToRemoveEndorsement.endorsers;
          endorsersArr.splice(endorsersArr.indexOf(req.body.unhappyUser), 1);
          userToRemoveEndorsement.update(
            {
              endorsers: endorsersArr,
            },
          )
            //Remove from endorser's endorsed array
            .then(() => {
              User.findOne({
                where: {
                  id: req.body.unhappyUser,
                },
              })
                .then((unhappyUser) => {
                  let endorsedArr = unhappyUser.endorsed;
                  endorsedArr.splice(endorsedArr.indexOf(req.body.userToRemoveEndorsement), 1);
                  unhappyUser.update(
                    {
                      endorsed: endorsedArr,
                    },
                  )
                  res.json({ userToRemoveEndorsement, unhappyUser });
                })
            })
            .catch((err) => res.status(400).send(err));
        } else {
          res.status(400).send('Not endorsed by the user.')
        }
      })
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
        endorsed: req.body.endorsed,
        endorsers: req.body.endorsers,
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

  methods.login = (req, res) => {
    const hashedPw = req.body.password;
    methods.findByNric(req.body.nric).then((user) => {
      if (user) {
        if (bcrypt.compareSync(hashedPw, user.password)) {
          user.access = jwt.sign(user.dataValues, SECRET_KEY, {
            expiresIn: 1440,
          });
          return res.send(user);
        } else {
          res.send('Wrong password');
        }
      } else {
        res.status(400).send('User does not exist.');
      }
    });
  };

  methods.calculateTotalCreditScore = (req, res) => {
    let socialCreditScore = 0;
    methods.findByNric(req.body.nric).then((user) => {
      if (user) {
        let promiseArr = [];
        for (let i = 0; i < user.endorsers.length; i++) {
          let promise1 =
            User.findOne({
              where: {
                id: user.endorsers[i],
              },
            })
              .then((endorser) => {
                return endorser.credit_score;
              })
          promiseArr.push(promise1)
        }
        Promise.all(promiseArr).then((arr) => {
          for (let i = 0; i < arr.length; i++) {
            socialCreditScore += arr[i];
          }
          res.json(user.credit_score + Math.round(socialCreditScore / arr.length));
        })
      } else {
        res.status(400).send('User does not exist.');
      }
    })
  }

  //************** MAMBU API *****************************/
  const mambuInstance = axios.create({
    baseURL: 'https://razerhackathon.sandbox.mambu.com/api',
    auth: mambuAuth
  });

  methods.getCurrentAccountTransactions = (req, res) => {
    mambuInstance.get('/savings/CRTC897/transactions')
      .then((mambuRes) => {
        res.json(mambuRes.data)
      })
      .catch((err) => res.status(400).send(err));
  }
  return methods;
};