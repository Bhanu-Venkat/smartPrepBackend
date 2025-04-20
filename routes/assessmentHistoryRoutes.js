// routes/assessmentHistory.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/assessmentHistoryController');

// POST - Create record
router.post('/', controller.createAssessmentRecord);

// GET - Fetch records by userId and optional query filters
router.get('/:userId', controller.getAssessmentHistoryByUserId);

module.exports = router;
