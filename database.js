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
db.Tag = require('./models/Tag');
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
    db.Tag.bulkCreate(data.tags).then((tags) => {
      for (let i = 0; i < tags.length; i++) {
        users[0].setTags(tags[i]);
      }
      db.Card.bulkCreate(data.cards).then((cards) => {
        for (let i = 0; i < cards.length; i++) {
          users[0].setCards(cards[i]);
        }

      });
    });
  });
});
