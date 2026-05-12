const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:5173'] : '*',
  credentials: true
}));
app.use(express.json());

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const specialtyRoutes = require('./routes/specialties');
const trainingRoutes = require('./routes/trainings');
const speakerRoutes = require('./routes/speakers');
const talkRoutes = require('./routes/talks');
const requestRoutes = require('./routes/requests');
const workerRoutes = require('./routes/workers');
const dashboardRoutes = require('./routes/dashboard');

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/specialties', specialtyRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/speakers', speakerRoutes);
app.use('/api/talks', talkRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('API de Gestión de Capacitaciones funcionando');
});

// Sincronizar base de datos
sequelize.sync({ alter: true }).then(() => {
  console.log('Base de datos sincronizada');
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}).catch(err => {
  console.error('Error al sincronizar la base de datos:', err);
});
