const express = require('express');
const router = express.Router();
const { Worker, Service, Request, Talk, Training, Speaker } = require('../models');
const { auth } = require('../middleware/auth');

// Get all workers
router.get('/', auth, async (req, res) => {
  try {
    const workers = await Worker.findAll({
      include: [Service]
    });
    res.json(workers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener trabajadores' });
  }
});

// Get worker by ID with assignments
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const worker = await Worker.findByPk(id, {
      include: [
        { 
          model: Service,
          include: [Training]
        },
        { model: Training },
        {
          model: Request,
          include: [
            {
              model: Talk,
              include: [Training, Speaker]
            }
          ]
        }
      ]
    });
    
    if (!worker) {
      return res.status(404).json({ message: 'Trabajador no encontrado' });
    }

    // Fetch Corporate Trainings
    const corporateService = await Service.findOne({
      where: { name: 'Corporativo' },
      include: [Training]
    });

    res.json({
      worker,
      directTrainings: worker.Trainings || [],
      serviceTrainings: worker.Service?.Trainings || [],
      corporateTrainings: corporateService?.Trainings || []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener detalles del trabajador' });
  }
});

// Create worker
router.post('/', auth, async (req, res) => {
  try {
    const { name, rut, ServiceId } = req.body;
    const worker = await Worker.create({ name, rut, ServiceId });
    res.status(201).json(worker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear trabajador' });
  }
});

// Update worker
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rut, ServiceId } = req.body;
    const worker = await Worker.findByPk(id);
    if (!worker) {
      return res.status(404).json({ message: 'Trabajador no encontrado' });
    }
    await worker.update({ name, rut, ServiceId });
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar trabajador' });
  }
});

// Delete worker
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const worker = await Worker.findByPk(id);
    if (!worker) {
      return res.status(404).json({ message: 'Trabajador no encontrado' });
    }
    await worker.destroy();
    res.json({ message: 'Trabajador eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar trabajador' });
  }
});

// Assign trainings to worker (Operator and Admin)
router.post('/:id/trainings', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { trainingIds } = req.body;
    const worker = await Worker.findByPk(id);
    if (!worker) {
      return res.status(404).json({ message: 'Trabajador no encontrado' });
    }
    await worker.setTrainings(trainingIds);
    res.json({ message: 'Capacitaciones asignadas exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al asignar capacitaciones' });
  }
});

module.exports = router;
