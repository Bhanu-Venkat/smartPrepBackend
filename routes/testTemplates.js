const express = require('express');
const router = express.Router();
const {
    createTestTemplate,
    getTestTemplates,
    getTestTemplate,
    updateTestTemplate,
    deleteTestTemplate
} = require('../controllers/testTemplateController');

// Test Template routes
router.route('/')
    .post(createTestTemplate)
    .get(getTestTemplates);

router.route('/:id')
    .get(getTestTemplate)
    .put(updateTestTemplate)
    .delete(deleteTestTemplate);

module.exports = router;
