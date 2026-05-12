const express = require('express');
const router = express.Router();
const { Service, Training } = require('../models');
const { auth, admin } = require('../middleware/auth');

// Get all services
router.get('/', auth, async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener servicios' });
  }
});

// Create service (Admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const service = await Service.create({ name, description });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear servicio' });
  }
});

// Update service (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    await service.update({ name, description });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar servicio' });
  }
});

// Delete service (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    await service.destroy();
    res.json({ message: 'Servicio eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar servicio' });
  }
});

// Assign trainings to service (Admin only)
router.post('/:id/trainings', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { trainingIds } = req.body;
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    await service.setTrainings(trainingIds);
    res.json({ message: 'Capacitaciones asignadas exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al asignar capacitaciones' });
  }
});

module.exports = router;
