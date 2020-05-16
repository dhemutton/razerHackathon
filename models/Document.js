const { DataTypes } = require('sequelize');
const db = require('../database');

const Document = db.sequelize.define(
  'Document',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.TEXT,
    },
    file_path: {
        type: DataTypes.TEXT,
        defaultValue: "404.png"

      },
  },
  {
    underscored: true,
    freezetableName: true,
    tableName: 'documents',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

Document.associate = (db) => {
  db.Document.belongsTo(db.User, {
    foreignKey: 'userId',
  });
};

module.exports = Document;