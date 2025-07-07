const mongoose = require('mongoose');
const bluePrint = require('./bluePrint');
const testTemplate = require('./testTemplate');

const customAssessmentSchema = new mongoose.Schema({
  assessment: {
    totalTime: String,
    sections: [
      {
        sectionName: String,
        questions: [
          {
            affiliation: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliation' },
            topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
            question: String,
            options: [String],
            correctOption: String,
            difficulty_level: String,
            created_by: String,
            typology: String,
            question_type: String,
            weightage: Number,
            isActive: Boolean,
            createdDate: Date,
            createdAt: Date,
            updatedAt: Date
          }
        ]
      }
    ],
    testTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestTemplate' },
    bluePrintId: { type: mongoose.Schema.Types.ObjectId, ref: 'BluePrint' },
    testTemplate: String,
    bluePrint: String,
  }
});

module.exports = mongoose.model('CustomAssessment', customAssessmentSchema);
