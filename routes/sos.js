const express = require('express');
const router = express.Router();
const sosController = require('../controllers/sosController');

// Trigger SOS alert
router.post('/alert', sosController.triggerAlert);

module.exports = router;
