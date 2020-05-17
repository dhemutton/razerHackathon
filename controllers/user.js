const User = require('../models/User');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fileName = '';
var path = require('path');
const multer = require('multer');
const store = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/profilepics');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname+'.'+file.mimetype.split('/')[1]);
        fileName = file.originalname+'.'+file.mimetype.split('/')[1];
    }
});
var upload = multer({storage:store}).single('file');

const mambuAuth = {
  username: process.env.MAMBU_USER,
  password: process.env.MAMBU_PASS
}

const fwdAuth = {
  username: process.env.FWD_USER,
  password: process.env.FWD_PASS
}

const mambuInstance = axios.create({
  baseURL: 'https://razerhackathon.sandbox.mambu.com/api',
  auth: mambuAuth
});

const fwdInstance = axios.create({
  baseURL: 'https://niw1itg937.execute-api.ap-southeast-1.amazonaws.com/Prod/verify',
  auth: fwdAuth
});


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
            let test = {
              "client": {
                "firstName": req.body.first_name,
                "lastName": req.body.last_name,
                "preferredLanguage": "ENGLISH",
                "notes": "Enjoys playing RPG",
                "assignedBranchKey": process.env.MAMBU_BRANCHID,
              },
              "idDocuments": [
                {
                  "identificationDocumentTemplateKey": "8a8e867271bd280c0171bf7e4ec71b01",
                  "issuingAuthority": "Immigration Authority of Singapore",
                  "documentType": "NRIC/Passport Number",
                  "validUntil": "2021-09-12",
                  "documentId": req.body.nric,
                }
              ],
              "addresses": [],
              "customInformation": [
                {
                  "value": "Singapore",
                  "customFieldID": "countryOfBirth"
        
                },
              ]
            }
            mambuInstance.post(`/clients`, test)
              .then((mambuRes) => {
                //save to the user here
                console.log(mambuRes.data.client.encodedKey)
                User.update(
                  {
                    client_id: mambuRes.data.client.encodedKey
                  },
                  {
                    where: {
                      nric: req.body.nric,
                    },
                  }
                )
                res.json(mambuRes.data)
              })
              .catch((err) => res.status(400).send(err));            
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
          user.access = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
            expiresIn: 1440,
          });
          return res.send(user.access);
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
        if (user.endorsers.length!=0){
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
          res.json(Math.min(user.credit_score + Math.round(0.1*(socialCreditScore / arr.length)),100));
        })
        } else {
          res.json(Math.min(user.credit_score,100));
        }
        
      } else {
        res.status(400).send('User does not exist.');
      }
    })
  }

  //************** MAMBU API *****************************/


  methods.getCurrentAccountTransactions = (req, res) => {
    mambuInstance.get(`/savings/${req.body.currentAccountId}/transactions`)
      .then((mambuRes) => {
        res.json(mambuRes.data)
      })
      .catch((err) => res.status(400).send(err));
  }

  methods.getCurrentAccount = (req, res) => {
    mambuInstance.get(`/savings/${req.body.currentAccountId}/?`)
      .then((mambuRes) => {
        res.json(mambuRes.data)
      })
      .catch((err) => res.status(400).send(err));
  }

  methods.getLoanAccountTransactions = (req, res) => {
    mambuInstance.get(`/loans/${req.body.loanAccountId}/transactions`)
      .then((mambuRes) => {
        res.json(mambuRes.data)
      })
      .catch((err) => res.status(400).send(err));
  }

  methods.getLoanAccount = (req, res) => {
    mambuInstance.get(`/loans/${req.body.loanAccountId}/?`)
      .then((mambuRes) => {
        res.json(mambuRes.data)
      })
      .catch((err) => res.status(400).send(err));
  }

  // methods.createClient = (req, res) => {
  //   let test = {
  //     "client": {
  //       "firstName": "Winnie",
  //       "lastName": "Goh",
  //       "preferredLanguage": "ENGLISH",
  //       "notes": "Enjoys playing RPG",
  //       "assignedBranchKey": process.env.MAMBU_BRANCHID,
  //     },
  //     "idDocuments": [
  //       {
  //         "identificationDocumentTemplateKey": "8a8e867271bd280c0171bf7e4ec71b01",
  //         "issuingAuthority": "Immigration Authority of Singapore",
  //         "documentType": "NRIC/Passport Number",
  //         "validUntil": "2021-09-12",
  //         "documentId": req.body.nric,
  //       }
  //     ],
  //     "addresses": [],
  //     "customInformation": [
  //       {
  //         "value": "Singapore",
  //         "customFieldID": "countryOfBirth"

  //       },
  //     ]
  //   }
  //   mambuInstance.post(`/clients`, test)
  //     .then((mambuRes) => {
  //       //save to the user here
  //       console.log(mambuRes.data.client.encodedKey)
  //       User.update(
  //         {
  //           client_id: mambuRes.data.client.encodedKey
  //         },
  //         {
  //           where: {
  //             nric: req.body.nric,
  //           },
  //         }
  //       )
  //       res.json(mambuRes.data)
  //     })
  //     .catch((err) => res.status(400).send(err));
  // }

  methods.verifyKYC = (req, res) => {
    let test = {
      base64image: req.body.base64image,
    }
    fwdInstance.post(``, test)
      .then((fwdRes) => {
        res.json({verified: fwdRes.data.qualityCheck.finalDecision, data:fwdRes.data })
      })        
      .catch((err) => res.status(400).send(err));
  }

  methods.createCurrentAccount = (req, res) => {
    let test = {
      "savingsAccount": {
        "name": "Digital Account",
        "accountHolderType": "CLIENT",
        "accountHolderKey": req.body.clientId, //this is the encoded key after client creation
        "accountState": "APPROVED",
        "productTypeKey": "8a8e878471bf59cf0171bf6979700440",
        "accountType": "CURRENT_ACCOUNT",
        "currencyCode": "SGD",
        "allowOverdraft": "true",
        "overdraftLimit": "100",
        "overdraftInterestSettings": {
          "interestRate": 5 //change this according to credit score
        },
        "interestSettings": {
          "interestRate": "1.25" //change this according to credit score
        }
      }

    }
    mambuInstance.post(`/savings`, test)
      .then((mambuRes) => {
        //save to the user here
        User.update(
          {
            current_account_id: mambuRes.data.client.id
          },
          {
            where: {
              nric: req.body.nric,
            },
          }
        )
        res.json(mambuRes.data)
      })
      .catch((err) => res.status(400).send(err));
  }

  methods.createClient = (req, res) => {
    let test = {
      "client": {
        "firstName": "Winnie",
        "lastName": "Goh",
        "preferredLanguage": "ENGLISH",
        "notes": "Enjoys playing RPG",
        "assignedBranchKey": process.env.MAMBU_BRANCHID,
      },
      "idDocuments": [
        {
          "identificationDocumentTemplateKey": "8a8e867271bd280c0171bf7e4ec71b01",
          "issuingAuthority": "Immigration Authority of Singapore",
          "documentType": "NRIC/Passport Number",
          "validUntil": "2021-09-12",
          "documentId": req.body.nric,
        }
      ],
      "addresses": [],
      "customInformation": [
        {
          "value": "Singapore",
          "customFieldID": "countryOfBirth"

        },
      ]
    }
    mambuInstance.post(`/clients`, test)
      .then((mambuRes) => {
        //save to the user here
        console.log(mambuRes.data.client.encodedKey)
        User.update(
          {
            client_id: mambuRes.data.client.encodedKey
          },
          {
            where: {
              nric: req.body.nric,
            },
          }
        )
        res.json(mambuRes.data)
      })
      .catch((err) => res.status(400).send(err));
  }

  methods.createLoanAccount = (req, res) => {
    let test = {
      "loanAccount": {
        "accountHolderType": "CLIENT",
        "accountHolderKey": req.body.client_id,
        "productTypeKey": "8a8e867271bd280c0171bf768cc31a89",
        "assignedBranchKey": process.env.MAMBU_BRANCHID,
        "loanName": "Student Loan",
        "loanAmount": req.body.loanAmount,
        "interestRate": req.body.interestRate,
        "arrearsTolerancePeriod": "0",
        "gracePeriod": "0",
        "repaymentInstallments": req.body.repaymentInstallments,
        "repaymentPeriodCount": "1",
        "periodicPayment": "0",
        "repaymentPeriodUnit": "WEEKS",
        "disbursementDetails": {
          "customInformation": [
            {
              "value": "unique identifier for this transaction",
              "customFieldID": "IDENTIFIER_TRANSACTION_CHANNEL_I"
            }
          ]
        }
      }
    }
    mambuInstance.post(`/loans`, test)
      .then((mambuRes) => {
        //save to the user here
        console.log(mambuRes.data.loanAccount.encodedKey)
        User.update(
          {
            loan_account_id: mambuRes.data.loanAccount.id
          },
          {
            where: {
              client_id: req.body.client_id,
            },
          }
        )
        res.json(mambuRes.data)
      })
      .catch((err) => res.status(400).send(err));
  }

  methods.uploadDoc = (req, res) => {
    console.log('uploading');
    upload(req, res, function(err) {
        if(err) {
            console.log(err);
             res.status(500).json({error: err})
        }
        console.log(req.body);
        User.findOne({
            where: {id: req.body.id}
        }).then(
            user => {
              user.update(
                    {profile_picture: fileName}
                )
                res.json('success');
                fileName = '';
            }
        )
    });
  }

  methods.viewFile = (req, res) => {
    params = req.query.file_path
    console.log(params)
    filepath = path.join(__dirname, '../uploads/profilepics/') + params;
    console.log(filepath);
    res.sendFile(filepath);
  }  


  return methods;
};