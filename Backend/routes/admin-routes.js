const express = require('express');
const adminController = require('../controllers/admin-controller');

const router = express.Router();

// POST /api/admin/login - Admin login
router.post('/login', adminController.login);

// GET /api/admin/settings/:key - Get a specific setting
router.get('/settings/:key', adminController.verifyToken, adminController.getSetting);

// POST /api/admin/settings - Set or update a setting
router.post('/settings', adminController.verifyToken, adminController.setSetting);

// GET /api/admin/settings - Get all settings
router.get('/settings', adminController.verifyToken, adminController.getAllSettings);

module.exports = router;