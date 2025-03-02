const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    topicId: {type: mongoose.Schema.Types.ObjectId, required:true, default: () => new mongoose.Types.ObjectId()},
    topicName: String,
    isActive: Boolean,
    rules: {
        level1: Number
    }
});

const chapterSchema = new mongoose.Schema({
    unitId: {type: mongoose.Schema.Types.ObjectId, required:true, default: () => new mongoose.Types.ObjectId()},
    unitName: String,
    isActive: Boolean,
    topics: [topicSchema]
});

const subjectSchema = new mongoose.Schema({
    subjectId: {type: mongoose.Schema.Types.ObjectId, required:true, default: () => new mongoose.Types.ObjectId()},
    subjectName: String,
    chapters: [chapterSchema]
});

const standardSchema = new mongoose.Schema({
    gradeId: {type: mongoose.Schema.Types.ObjectId, required:true, default: () => new mongoose.Types.ObjectId()},
    grade: String,
    subjects: [subjectSchema]
});

const affiliationSchema = new mongoose.Schema({
    affiliation: String,
    standard: [standardSchema],
    createdBy: String,
    createdDate: { type: Date, default: Date.now },
    modifiedBy: String,
    modifiedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Affiliation', affiliationSchema);
