const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Training = sequelize.define('Training', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  duration: {
    type: DataTypes.INTEGER,
  },
  isCertified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Training;
