const mongoose = require("mongoose");

const MarksDistributionSchema = new mongoose.Schema({
    marks: { type: Number, required: true },
    noOfQuestions: { type: Number, required: true }
});

const BlueprintTypologySchema = new mongoose.Schema({
    _id: { type: String, required: true },
    typology: { type: String, required: true },
    marksDistribution: [MarksDistributionSchema]
});

const BlueprintSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    exam: { type: String, required: true },
    blueprintType: { type: String, required: true },
    blueprintName: { type: String, required: true },
    subjectId: { type: String, required: true },
    maximumMarks: { type: Number, required: true },
    typologies: [BlueprintTypologySchema],
    isActive: { type: Boolean, default: true },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String, required: true }
});

module.exports = mongoose.model("Blueprint", BlueprintSchema);
