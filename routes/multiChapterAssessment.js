const express = require('express');
const router = express.Router();
const { createMultiChapterAssessment, getMultiChapterAssessments, getCustomAssessmentById } = require('../controllers/multiChapterAssessmentController');

router.post('/', createMultiChapterAssessment);
// router.get('/:fieldName/:fieldValue', getMultiChapterAssessments);
router.get('/custom/:id', getCustomAssessmentById);



module.exports = router;
