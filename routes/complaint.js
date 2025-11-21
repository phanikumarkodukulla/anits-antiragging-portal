const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const upload = require('../middleware/upload');

// Submit complaint form
router.get('/submit', complaintController.showSubmitForm);

// Handle complaint submission
router.post('/submit', upload.array('evidenceFiles', 10), complaintController.submitComplaint);

// Complaint success page
router.get('/success/:complaintId', complaintController.successPage);

// Track complaint
router.get('/track', complaintController.showTrackForm);
router.post('/track', complaintController.trackComplaint);

module.exports = router;
