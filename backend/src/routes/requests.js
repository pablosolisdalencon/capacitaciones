const express = require('express');
const router = express.Router();
const { Request, Worker, Talk, Training } = require('../models');
const { auth, admin } = require('../middleware/auth');

// Get all requests
router.get('/', auth, async (req, res) => {
  try {
    const requests = await Request.findAll({
      include: [
        { model: Worker },
        { model: Talk, include: [Training] }
      ]
    });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener solicitudes' });
  }
});

// Update request status (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;
    const request = await Request.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    await request.update({ status, comment });
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar solicitud' });
  }
});

// Create request
router.post('/', auth, async (req, res) => {
  try {
    const { type, WorkerId, TalkId, comment } = req.body;
    const request = await Request.create({ type, WorkerId, TalkId, comment });
    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear solicitud' });
  }
});

module.exports = router;
