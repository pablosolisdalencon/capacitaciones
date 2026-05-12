const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Worker = sequelize.define('Worker', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rut: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Worker;
