const config = require('./config');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(config.dbEndpoint, {
  dialect: 'postgres',
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = db;

/**
 *
 * Initialize database connection
 *
 */

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection was successfully established.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database. ' + err);
  });

db.User = require('./models/User');
db.Document = require('./models/Document');
db.Card = require('./models/Card');

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

/**
 *
 * Database Seeder
 *
 */

const data = require('./test_data');
// let tempCriteria;
db.sequelize.sync({ force: true }).then(() => {
  db.User.bulkCreate(data.users).then((users) => {
    db.Document.bulkCreate(data.documents).then((documents) => {
      for (let i = 0; i < documents.length; i++) {
        users[0].setDocuments(documents[i]);
      }
      db.Card.bulkCreate(data.cards).then((cards) => {
        for (let i = 0; i < cards.length; i++) {
          users[0].setCards(cards[i]);
        }

      });
    });
  });
});
