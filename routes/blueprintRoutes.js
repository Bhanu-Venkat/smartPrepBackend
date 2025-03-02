const express = require("express");
const { createBlueprint, getBlueprints, createTestTemplate, getTestTemplates } = require("../controllers/blueprintController");

const router = express.Router();

// Blueprint Routes
router.post("/", createBlueprint);
router.get("/", getBlueprints);

// Test Template Routes
router.post("/test-templates", createTestTemplate);
router.get("/test-templates", getTestTemplates);

module.exports = router;
