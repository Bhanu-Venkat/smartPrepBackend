const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
    sectionText: { type: String, required: true },
    noOfQuestions: { type: Number, required: true },
    marksPerQuestion: { type: Number, required: true }
});

const TestTemplateSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    blueprintId: { type: String, required: true },
    templateName: { type: String, required: true },
    headerText1: { type: String },
    headerText2: { type: String },
    headerText3: { type: String },
    headerText4: { type: String },
    totalTime: { type: String, required: true },
    timeLimitApplicable: { type: Boolean, default: false },
    autoSubmit: { type: Boolean, default: false },
    sections: [SectionSchema],
    isActive: { type: Boolean, default: true },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
    modifiedOn: { type: Date }
});

module.exports = mongoose.model("TestTemplate", TestTemplateSchema);
