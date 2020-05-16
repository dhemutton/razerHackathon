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

data.tags = [
  {
    title: 'Entertainment',
    budget: 10,
  },
  {
    title: 'Food',
    budget: 30,
  },
  {
    title: 'Savings',
    budget: 50,
  },
];

data.cards = [
  {
    card_number: '11111111',
    first_name: 'User',
    last_name: 'One',
    expiry_date: Date.parse('2021-08-11T10:00:00.000Z')
  },
  {
    card_number: '22222222',
    first_name: 'User',
    last_name: 'One',
    expiry_date: Date.parse('2021-08-11T10:00:00.000Z')
  },
  {
    card_number: '33333333',
    first_name: 'User',
    last_name: 'One',
    expiry_date: Date.parse('2021-08-11T10:00:00.000Z')
  },
];

module.exports = data;
