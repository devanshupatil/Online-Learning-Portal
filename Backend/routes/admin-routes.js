const express = require('express');
const adminController = require('../controllers/admin-controller');

const router = express.Router();

// GET /api/admin/settings/:key - Get a specific setting
router.get('/settings/:key', adminController.getSetting);

// POST /api/admin/settings - Set or update a setting
router.post('/settings', adminController.setSetting);

// GET /api/admin/settings - Get all settings
router.get('/settings', adminController.getAllSettings);

module.exports = router;