const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Evaluation = sequelize.define('Evaluation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  score: {
    type: DataTypes.FLOAT,
  },
  status: {
    type: DataTypes.ENUM('Aprobado', 'Reprobado'),
  },
  comments: {
    type: DataTypes.STRING,
  },
});

module.exports = Evaluation;
