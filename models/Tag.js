const { DataTypes } = require('sequelize');
const db = require('../database');

const Tag = db.sequelize.define(
  'Tag',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.TEXT,
    },
    budget: {
        type: DataTypes.INTEGER,
      },
  },
  {
    underscored: true,
    freezetableName: true,
    tableName: 'tags',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

Tag.associate = (db) => {
  db.Tag.belongsTo(db.User, {
    foreignKey: 'userId',
  });
};

module.exports = Tag;