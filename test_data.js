const data = {};



data.users = [
  {
    first_name: 'User',
    last_name: 'One',
    nric: 'S1234567A',
    email: 'userone@mail.com',
    password: 'password',
    contact_number: '88888888',
    client_id:'8a8e862a7217508901721d34c12b33ee',
  },
  {
    first_name: 'User',
    last_name: 'Two',
    nric: 'S1234567B',
    email: 'usertwo@mail.com',
    password: 'password',
    contact_number: '11111111',
    client_id:'8a8e862a7217508901721ec1143e388d',
  },
  {
    first_name: 'User',
    last_name: 'Three',
    nric: 'S1234567C',
    email: 'usertwo@mail.com',
    credit_score: 100,
    password: 'password',
    contact_number: '11111111',
    client_id:'8a8e862a7217508901721ec1abe0389d',
  },
];

data.documents = [
  {
    title: 'Certificate',
  },
  {
    title: 'Nric',
  },
  {
    title: 'Passport',
  },
];

data.cards = [
  {
    card_number: '8d212293-c6bc-4738-afaf-bc0ae5456df5',
    first_name: 'User',
    last_name: 'One',
    expiry_date: Date.parse('2021-08-11T10:00:00.000Z')
  },
  {
    card_number: '8d212293-c6bc-4738-afaf-bc0ae5456df5',
    first_name: 'User',
    last_name: 'One',
    expiry_date: Date.parse('2021-08-11T10:00:00.000Z')
  },
  {
    card_number: '8d212293-c6bc-4738-afaf-bc0ae5456df5',
    first_name: 'User',
    last_name: 'One',
    expiry_date: Date.parse('2021-08-11T10:00:00.000Z')
  },
];

module.exports = data;
