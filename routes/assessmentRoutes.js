// routes/assessment.routes.js
const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');

router.post('/create', assessmentController.createAssessment);

module.exports = router;
