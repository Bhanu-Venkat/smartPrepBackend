const express = require('express');
const { createAffiliation, modifyAffiliation, getAffiliationById } = require('../controllers/affiliationController');

const router = express.Router();

router.post('/create', createAffiliation);
router.put('/modify', modifyAffiliation);
router.get('/:affiliationId',getAffiliationById)

module.exports = router;
