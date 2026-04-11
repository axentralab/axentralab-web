const express = require('express');
const router = express.Router();
const aiLeadController = require('../controllers/aiLeadController');
const { protect, adminOnly } = require('../middleware/auth');

/**
 * Public Routes
 */
router.post('/', aiLeadController.createLead);  // Create lead (auto-scored)

/**
 * Admin Routes
 */

// Get all leads
router.get('/', protect, adminOnly, aiLeadController.getLeads);

// Get single lead
router.get('/:id', protect, adminOnly, aiLeadController.getLead);

// Update lead
router.put('/:id', protect, adminOnly, aiLeadController.updateLead);

// Delete lead
router.delete('/:id', protect, adminOnly, aiLeadController.deleteLead);

// AI Features
router.post('/:id/auto-proposal', protect, adminOnly, aiLeadController.autoGenerateProposal);
router.post('/:id/send-proposal', protect, adminOnly, aiLeadController.sendProposalEmail);
router.post('/:id/send-followup', protect, adminOnly, aiLeadController.sendFollowup);

// Reports & Analytics
router.get('/admin/high-priority', protect, adminOnly, aiLeadController.getHighPriorityLeads);
router.get('/admin/followup-candidates', protect, adminOnly, aiLeadController.getFollowupCandidates);
router.get('/admin/analytics', protect, adminOnly, aiLeadController.getLeadAnalytics);

module.exports = router;
