const data = {};



data.users = [
  {
    first_name: 'User',
    last_name: 'One',
    nric: 'S1234567A',
    email: 'userone@mail.com',
    password: 'password',
    credit_score: 5,
    contact_number: '88888888',
  },
  {
    first_name: 'User',
    last_name: 'Two',
    nric: 'S1234567B',
    email: 'usertwo@mail.com',
    password: 'password',
    credit_score: 5,
    contact_number: '11111111',
  },
  {
    first_name: 'User',
    last_name: 'Three',
    nric: 'S1234567C',
    email: 'usertwo@mail.com',
    password: 'password',
    credit_score: 5,
    contact_number: '11111111',
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
