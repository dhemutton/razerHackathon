const { DataTypes } = require('sequelize');
const db = require('../database');
const bcrypt = require('bcryptjs');

const User = db.sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nric: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(password) {
        this.setDataValue('password', bcrypt.hashSync(password, bcrypt.genSaltSync(10)));
      },
    },
    contact_number: {
      type: DataTypes.STRING,
    },
    client_id: {
      type: DataTypes.STRING,
    },
    credit_score: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      min: 0,
      max: 100
    },
    current_account_id: {
      type: DataTypes.STRING,
    },
    loan_account_id: {
      type: DataTypes.STRING,
    },
    endorsers: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: []
    },
    endorsed: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: []
    },
    profile_picture: {
      type: DataTypes.STRING,
      defaultValue: "404.png"
    }
  },
  {
    underscored: true,
    freezetableName: true,
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

User.associate = (db) => {
  db.User.hasMany(db.Document, {
    foreignKey: 'userId',
  });

  db.User.hasMany(db.Card, {
    foreignKey: 'userId',
  });
};

module.exports = User;
