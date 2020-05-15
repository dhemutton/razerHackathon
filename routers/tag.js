const express = require('express');
const router = express.Router();
const tag = require('../controllers/tag')();

// create tag
router.post('/create', tag.create);

// get all tags
router.get('/retrieveAll', tag.retrieveAll);

// get tag by ID
router.get('/retrieveById', tag.findById);

// update tag by ID
router.post('/update', tag.update);

// delete tag by ID
router.delete('/delete', tag.deleteById);

module.exports = router;
