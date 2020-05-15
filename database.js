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
// db.Study = require('./models/Study');
// db.ResearcherStudy = require('./models/ResearcherStudy');
// db.Organisation = require('./models/Organisation');
// db.Criterion = require('./models/Criterion');
// db.CriterionStudy = require('./models/CriterionStudy');
// db.Question = require('./models/Question');
// db.Option = require('./models/Option');
// db.OptionParticipant = require('./models/OptionParticipant');
// db.Administrator = require('./models/Administrator');
// db.Appointment = require('./models/Appointment');
// db.AppointmentParticipant = require('./models/AppointmentParticipant');

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
  //   db.Participant.bulkCreate(data.participants);
  //   db.Criterion.bulkCreate(data.criteria).then((criteria) => {
  //     tempCriteria = criteria;
  //   });
  // db.User.bulkCreate(data.users);
  //   db.Option.bulkCreate(data.options).then((options) => {
  //     tempCriteria[0].setOption(options[0]); //has done internship : yes (have you...)
  //     tempCriteria[1].setOption(options[2]); //is a pet owner : yes (are you a pet owner)
  //     tempCriteria[2].setOption(options[4]); //has a healthy BMI : <25 (what is your bmi)
  //     tempCriteria[3].setOption(options[7]); //acne-free : no (has acne)

  db.User.bulkCreate(data.users).then((users) => {
    db.Tag.bulkCreate(data.tags).then((tags) => {

    for (let i = 0; i < tags.length; i++) {
      users[0].setTags(tags[i]);
    }
  });
});

  //   db.Organisation.bulkCreate(data.organisations).then((organisations) => {
  //     db.Study.bulkCreate(data.studies).then((studies) => {
  //       db.Researcher.bulkCreate(data.researchers).then((researchers) => {
  //         for (let i = 0; i < studies.length; i++) {
  //           studies[i].addCriteria(tempCriteria[i]);
  //           researchers[0].addStudy(studies[i]);
  //           researchers[i].setOrganisation(organisations[0]);
  //         }
  //         studies[0].addCriteria(tempCriteria[1]);
  //       });
  //     });
  //   });
});
