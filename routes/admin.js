const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth');

// Login routes
router.get('/login', isNotAuthenticated, adminController.showLogin);
router.post('/login', isNotAuthenticated, adminController.login);

// Logout
router.get('/logout', isAuthenticated, adminController.logout);

// Dashboard
router.get('/dashboard', isAuthenticated, adminController.dashboard);

// Complaints management
router.get('/complaints', isAuthenticated, adminController.listComplaints);
router.get('/complaints/:id', isAuthenticated, adminController.viewComplaint);
router.post('/complaints/:id/update', isAuthenticated, adminController.updateComplaint);
router.post('/complaints/:id/delete', isAuthenticated, adminController.deleteComplaint);

// Analytics
router.get('/analytics', isAuthenticated, adminController.analytics);

// Activity logs
router.get('/activity-logs', isAuthenticated, adminController.activityLogs);

// SOS Alerts
router.get('/sos-alerts', isAuthenticated, adminController.sosAlerts);
router.post('/sos-alerts/:id/update', isAuthenticated, adminController.updateSOSAlert);
router.post('/sos-alerts/:id/acknowledge', isAuthenticated, adminController.acknowledgeSOSAlert);
router.post('/sos-alerts/:id/resolve', isAuthenticated, adminController.resolveSOSAlert);
router.post('/sos-alerts/:id/delete', isAuthenticated, adminController.deleteSOSAlert);

// Profile
router.get('/profile', isAuthenticated, adminController.showProfile);
router.post('/profile/change-password', isAuthenticated, adminController.changePassword);

// Export routes
router.get('/export/csv', isAuthenticated, adminController.exportCSV);
router.get('/export/excel', isAuthenticated, adminController.exportExcel);
router.get('/export/pdf', isAuthenticated, adminController.exportPDF);

module.exports = router;
