const express = require('express');
const router = express.Router();
const { getAllUsers, getUserStats, toggleUser } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/',           protect, adminOnly, getAllUsers);
router.get('/stats',      protect, adminOnly, getUserStats);
router.put('/:id/toggle', protect, adminOnly, toggleUser);

module.exports = router;
