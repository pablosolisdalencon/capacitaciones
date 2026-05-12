const express = require('express');
const router = express.Router();
const { Training, Talk, Request, Worker, Service } = require('../models');
const { auth, admin } = require('../middleware/auth');

// Get all trainings
router.get('/', auth, async (req, res) => {
  try {
    const trainings = await Training.findAll({ include: [Service] });
    res.json(trainings);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener capacitaciones' });
  }
});

// Get training by ID with assignments
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const training = await Training.findByPk(id, {
      include: [
        { model: Service },
        {
          model: Talk,
          include: [
            {
              model: Request,
              include: [Worker]
            }
          ]
        }
      ]
    });
    
    if (!training) {
      return res.status(404).json({ message: 'Capacitación no encontrada' });
    }

    // Find all workers assigned or inherited
    let assignedWorkers = [];
    
    // 1. Direct requests workers
    const reqWorkers = training.Talks?.flatMap(talk => talk.Requests?.map(r => r.Worker) || []) || [];
    assignedWorkers.push(...reqWorkers.filter(Boolean));

    // 2. Inherited by service
    const serviceIds = training.Services?.map(s => s.id) || [];
    // Assume if it has 'Corporativo' service or isCertified it applies to all
    const isCorp = training.isCertified || training.Services?.some(s => s.name === 'Corporativo');
    
    let serviceWorkers = [];
    if (isCorp) {
      serviceWorkers = await Worker.findAll();
    } else if (serviceIds.length > 0) {
      serviceWorkers = await Worker.findAll({ where: { ServiceId: serviceIds } });
    }
    
    assignedWorkers.push(...serviceWorkers);

    // Deduplicate workers by ID
    const uniqueWorkers = Array.from(new Map(assignedWorkers.map(w => [w.id, w])).values());

    // Attach unique workers to the response object
    const responseData = training.toJSON();
    responseData.AssignedWorkers = uniqueWorkers;

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener detalles de la capacitación' });
  }
});

// Create training (Admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const { name, description, duration, isCertified } = req.body;
    const training = await Training.create({ name, description, duration, isCertified });
    res.status(201).json(training);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear capacitación' });
  }
});

// Update training (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, duration, isCertified } = req.body;
    const training = await Training.findByPk(id);
    if (!training) {
      return res.status(404).json({ message: 'Capacitación no encontrada' });
    }
    await training.update({ name, description, duration, isCertified });
    res.json(training);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar capacitación' });
  }
});

// Delete training (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const training = await Training.findByPk(id);
    if (!training) {
      return res.status(404).json({ message: 'Capacitación no encontrada' });
    }
    await training.destroy();
    res.json({ message: 'Capacitación eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar capacitación' });
  }
});

module.exports = router;
