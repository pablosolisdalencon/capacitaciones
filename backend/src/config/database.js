const { Sequelize } = require('sequelize');
require('dotenv').config();

const useSSL = process.env.DB_SSL === 'true';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'capacitaciones',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
    dialectOptions: useSSL ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {}
  }
);

module.exports = sequelize;
