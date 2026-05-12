const express = require('express');
const router = express.Router();
const { Worker, Training, Talk, Request } = require('../models');
const { auth } = require('../middleware/auth');

router.get('/stats', auth, async (req, res) => {
  try {
    const totalWorkers = await Worker.count();
    const totalTrainings = await Training.count();
    const totalTalks = await Talk.count();
    
    const pendingRequests = await Request.count({ where: { status: 'Pendiente' } });
    const approvedRequests = await Request.count({ where: { status: 'Aprobada' } });
    const rejectedRequests = await Request.count({ where: { status: 'Rechazada' } });

    res.json({
      totalWorkers,
      totalTrainings,
      totalTalks,
      requests: {
        pending: pendingRequests,
        approved: approvedRequests,
        rejected: rejectedRequests,
        total: pendingRequests + approvedRequests + rejectedRequests
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
});

module.exports = router;
