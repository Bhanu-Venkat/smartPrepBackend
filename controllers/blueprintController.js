const Blueprint = require("../models/blueprint");
const TestTemplate = require("../models/testTemplate");

// Create a new blueprint
exports.createBlueprint = async (req, res) => {
    try {
        const blueprint = new Blueprint(req.body);
        await blueprint.save();
        res.status(201).json({ success: true, data: blueprint });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get all blueprints
exports.getBlueprints = async (req, res) => {
    try {
        const blueprints = await Blueprint.find({ isActive: true });
        res.status(200).json({ success: true, data: blueprints });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get a single blueprint
exports.getBlueprint = async (req, res) => {
    try {
        const blueprint = await Blueprint.findById(req.params.id);
        if (!blueprint) {
            return res.status(404).json({ success: false, error: "Blueprint not found" });
        }
        res.status(200).json({ success: true, data: blueprint });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update a blueprint
exports.updateBlueprint = async (req, res) => {
    try {
        const blueprint = await Blueprint.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!blueprint) {
            return res.status(404).json({ success: false, error: "Blueprint not found" });
        }
        res.status(200).json({ success: true, data: blueprint });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete a blueprint (soft delete)
exports.deleteBlueprint = async (req, res) => {
    try {
        const blueprint = await Blueprint.findByIdAndUpdate(req.params.id, 
            { isActive: false },
            { new: true }
        );
        if (!blueprint) {
            return res.status(404).json({ success: false, error: "Blueprint not found" });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createTestTemplate = async (req, res) => {
  try {
    const { blueprintId, templateName, totalTime, timeLimitApplicable, autoSubmit, categories } = req.body;

    const testTemplate = new TestTemplate({
      blueprintId,
      templateName,
      totalTime,
      timeLimitApplicable,
      autoSubmit,
      categories
    });

    await testTemplate.save();
    res.status(201).json({ message: "Test template created successfully", testTemplate });
  } catch (error) {
    console.error("Error creating test template:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTestTemplates = async (req, res) => {
    try {
      const testTemplates = await TestTemplate.find().populate("blueprintId", "blueprint_name exam");
      res.status(200).json(testTemplates);
    } catch (error) {
      console.error("Error fetching test templates:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
