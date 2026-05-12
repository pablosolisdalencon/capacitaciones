const express = require('express');
const router = express.Router();
const Specialty = require('../models/Specialty');
const { auth, admin } = require('../middleware/auth');

// Get all specialties
router.get('/', auth, async (req, res) => {
  try {
    const specialties = await Specialty.findAll();
    res.json(specialties);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener especialidades' });
  }
});

// Create specialty (Admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const specialty = await Specialty.create({ name, description });
    res.status(201).json(specialty);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear especialidad' });
  }
});

// Update specialty (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const specialty = await Specialty.findByPk(id);
    if (!specialty) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }
    await specialty.update({ name, description });
    res.json(specialty);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar especialidad' });
  }
});

// Delete specialty (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const specialty = await Specialty.findByPk(id);
    if (!specialty) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }
    await specialty.destroy();
    res.json({ message: 'Especialidad eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar especialidad' });
  }
});

module.exports = router;
