const express = require('express');
const { createAffiliation, modifyAffiliation, getAffiliationById, getGradeByAffiliation } = require('../controllers/affiliationController');

const router = express.Router();

router.post('/create', createAffiliation);
router.put('/modify', modifyAffiliation);
router.get('/:affiliationId',getAffiliationById)
router.get('/grade/:affiliation/:grade', getGradeByAffiliation)

module.exports = router;
