const express = require('express');
const router = express.Router();
const { getServices, getService, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes (GET)
router.get('/', getServices);
router.get('/:id', getService); // Accepts both slug and MongoDB ID

// Admin routes (CREATE, UPDATE, DELETE)
router.post('/', protect, adminOnly, createService);
router.put('/:id', protect, adminOnly, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;
