const express = require('express');
const router = express.Router();
const card = require('../controllers/card')();

// create card
router.post('/create', card.create);

// get all card
router.get('/retrieveAll', card.retrieveAll);

// get card by ID
router.get('/retrieveById', card.findById);

// update card by ID
router.post('/update', card.update);

// delete card by ID
router.delete('/delete', card.deleteById);

router.post('/findByUserId', card.findByUserId);



module.exports = router;
