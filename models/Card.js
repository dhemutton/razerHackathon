const { DataTypes } = require('sequelize');
const db = require('../database');

const Card = db.sequelize.define(
  'Card',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    card_number: {
      type: DataTypes.TEXT,
    },
  },
  {
    underscored: true,
    freezetableName: true,
    tableName: 'cards',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

Card.associate = (db) => {
  db.Card.belongsTo(db.User, {
    foreignKey: 'userId',
  });
};

module.exports = Card;