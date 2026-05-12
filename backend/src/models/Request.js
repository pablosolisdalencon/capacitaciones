const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Request = sequelize.define('Request', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('Inscripcion', 'Creacion_Especialidad', 'Creacion_Capacitacion', 'Creacion_Agendamiento'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pendiente', 'Aprobada', 'Rechazada'),
    defaultValue: 'Pendiente',
  },
  comment: {
    type: DataTypes.STRING,
  },
});

module.exports = Request;
