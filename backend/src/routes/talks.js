const express = require('express');
const router = express.Router();
const { Talk, Training, Speaker } = require('../models');
const { auth, admin } = require('../middleware/auth');

// Get all talks
router.get('/', auth, async (req, res) => {
  try {
    const talks = await Talk.findAll({
      include: [Training, Speaker]
    });
    res.json(talks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener charlas' });
  }
});

// Create talk (Admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const { date, spots, TrainingId, SpeakerId } = req.body;
    const talk = await Talk.create({ date, spots, TrainingId, SpeakerId });
    res.status(201).json(talk);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear charla' });
  }
});

// Update talk (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, spots, status, TrainingId, SpeakerId } = req.body;
    const talk = await Talk.findByPk(id);
    if (!talk) {
      return res.status(404).json({ message: 'Charla no encontrada' });
    }
    await talk.update({ date, spots, status, TrainingId, SpeakerId });
    res.json(talk);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar charla' });
  }
});

// Delete talk (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const talk = await Talk.findByPk(id);
    if (!talk) {
      return res.status(404).json({ message: 'Charla no encontrada' });
    }
    await talk.destroy();
    res.json({ message: 'Charla eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar charla' });
  }
});

module.exports = router;
