const Document = require('../models/Document');

var fileName = '';
var path = require('path');
const multer = require('multer');
const store = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/documents');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname+'.'+file.mimetype.split('/')[1]);
        fileName = file.originalname+'.'+file.mimetype.split('/')[1];
    }
});
var upload = multer({storage:store}).single('file');

module.exports = () => {
  var methods = {};

  methods.uploadDoc = (req, res) => {
    console.log('uploading');
    upload(req, res, function(err) {
        if(err) {
            console.log(err);
             res.status(500).json({error: err})
        }
        console.log(req.body);
        Document.findOne({
            where: {id: req.body.id}
        }).then(
            document => {
              document.update(
                    {file_path: fileName}
                )
                res.json(res.status(200).send(req.body.file_path));
                fileName = '';
            }
        )
    });
  }

  methods.viewFile = (req, res) => {
    params = req.query.file_path
    console.log(params)
    filepath = path.join(__dirname, '../uploads/documents/') + params;
    console.log(filepath);
    res.sendFile(filepath);
  }  

  methods.create = (req, res) => {
    const documentData = {
      title: req.body.title,
      user_id: req.body.user_id,

    };

    Document.create(documentData)
      .then((document) => {
        document.setUser(documentData.user_id);
        res.json(document);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  };

  methods.findById = (req, res) => {
    Document.findOne({
      where: {
        id: req.query.id,
      },
    })
      .then((result) => res.json(result))
      .catch((err) => res.status(400).send(err));
  };

  methods.retrieveAllDocumentsForUser = (req, res) => {
    Document.findAll({
      where: {
        userId: req.query.id,
      },
    }).then((result) => {
      res.json(result);
    });
  };

  methods.retrieveAll = (req, res) => {
    Document.findAll().then((result) => {
      res.json(result);
    });
  };

  methods.update = (req, res) => {
    Document.update(
      {
        title: req.body.title,
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
    Document.findOne({
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
