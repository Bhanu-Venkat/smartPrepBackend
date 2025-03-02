const express = require('express');
const router = express.Router();
const {
    createBlueprint,
    getBlueprints,
    getBlueprint,
    updateBlueprint,
    deleteBlueprint
} = require('../controllers/blueprintController');

// Blueprint routes
router.route('/')
    .post(createBlueprint)
    .get(getBlueprints);

router.route('/:id')
    .get(getBlueprint)
    .put(updateBlueprint)
    .delete(deleteBlueprint);

module.exports = router;
