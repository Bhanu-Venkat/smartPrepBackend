const TestTemplate = require("../models/testTemplate");

// Create a new test template
exports.createTestTemplate = async (req, res) => {
    try {
        const testTemplate = new TestTemplate(req.body);
        await testTemplate.save();
        res.status(201).json({ success: true, data: testTemplate });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get all test templates
exports.getTestTemplates = async (req, res) => {
    try {
        const testTemplates = await TestTemplate.find({ isActive: true });
        res.status(200).json({ success: true, data: testTemplates });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get a single test template
exports.getTestTemplate = async (req, res) => {
    try {
        const testTemplate = await TestTemplate.findById(req.params.id);
        if (!testTemplate) {
            return res.status(404).json({ success: false, error: "Test template not found" });
        }
        res.status(200).json({ success: true, data: testTemplate });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update a test template
exports.updateTestTemplate = async (req, res) => {
    try {
        const testTemplate = await TestTemplate.findByIdAndUpdate(
            req.params.id,
            { ...req.body, modifiedOn: new Date() },
            {
                new: true,
                runValidators: true
            }
        );
        if (!testTemplate) {
            return res.status(404).json({ success: false, error: "Test template not found" });
        }
        res.status(200).json({ success: true, data: testTemplate });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete a test template (soft delete)
exports.deleteTestTemplate = async (req, res) => {
    try {
        const testTemplate = await TestTemplate.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!testTemplate) {
            return res.status(404).json({ success: false, error: "Test template not found" });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
