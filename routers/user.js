const express = require('express');
const router = express.Router();
const user = require('../controllers/user')();

// create user
router.post('/create', user.create);

// get all users
router.get('/retrieveAll', user.retrieveAll);

// get user by ID
router.get('/retrieveById', user.findById);

// update user by ID
router.post('/update', user.update);

// delete user by ID
router.delete('/delete', user.deleteById);

router.post('/login', user.login);

router.post('/endorseUser', user.endorseUser);

router.post('/removeEndorsement', user.removeEndorsement);

router.post('/calculateTotalCreditScore', user.calculateTotalCreditScore);

router.get('/getCurrentAccountTransactions', user.getCurrentAccountTransactions);
router.get('/getCurrentAccount', user.getCurrentAccount);
router.get('/getLoanAccount', user.getLoanAccount);
router.post('/createLoanAccount', user.createLoanAccount);

router.post('/createCurrentAccount', user.createCurrentAccount);
router.post('/createLoanAccount', user.createLoanAccount);

module.exports = router;
