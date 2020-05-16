const express = require('express');
const router = express.Router();
const document = require('../controllers/document')();

// create document
router.post('/create', document.create);

// get all documents
router.get('/retrieveAll', document.retrieveAll);

// get document by ID
router.get('/retrieveById', document.findById);

// update document by ID
router.post('/update', document.update);

// delete document by ID
router.delete('/delete', document.deleteById);

router.get('/retrieveAllDocumentsForUser', document.retrieveAllDocumentsForUser);
router.post('/uploadDoc', document.uploadDoc);
router.get('/viewFile', document.viewFile);



module.exports = router;
