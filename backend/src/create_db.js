const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDb() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'capacitaciones'}\`;`);
    console.log(`Base de datos '${process.env.DB_NAME || 'capacitaciones'}' creada o ya existía.`);
    await connection.end();
  } catch (error) {
    console.error('Error al crear la base de datos:', error);
  }
}

createDb();
