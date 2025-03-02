const express = require("express");
const upload = require("../utils/upload");
const { bulkUpload } = require("../controllers/questionsController");

const router = express.Router();

router.post("/upload-questions", upload.single("file"), bulkUpload);

module.exports = router;
