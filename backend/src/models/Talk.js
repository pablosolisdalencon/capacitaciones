const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Talk = sequelize.define('Talk', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  spots: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Programada', 'Realizada', 'Cancelada'),
    defaultValue: 'Programada',
  },
});

module.exports = Talk;
