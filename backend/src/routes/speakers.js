const express = require('express');
const router = express.Router();
const Speaker = require('../models/Speaker');
const { auth, admin } = require('../middleware/auth');

// Get all speakers
router.get('/', auth, async (req, res) => {
  try {
    const speakers = await Speaker.findAll();
    res.json(speakers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener relatores' });
  }
});

// Create speaker (Admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const speaker = await Speaker.create({ name, email, phone });
    res.status(201).json(speaker);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear relator' });
  }
});

// Update speaker (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const speaker = await Speaker.findByPk(id);
    if (!speaker) {
      return res.status(404).json({ message: 'Relator no encontrado' });
    }
    await speaker.update({ name, email, phone });
    res.json(speaker);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar relator' });
  }
});

// Delete speaker (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const speaker = await Speaker.findByPk(id);
    if (!speaker) {
      return res.status(404).json({ message: 'Relator no encontrado' });
    }
    await speaker.destroy();
    res.json({ message: 'Relator eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar relator' });
  }
});

module.exports = router;
