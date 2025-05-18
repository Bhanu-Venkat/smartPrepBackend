const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    affiliation: { type: mongoose.Schema.Types.ObjectId, ref: "Affiliation", required: true }, // Reference to Affiliation
    topic: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to Topic inside Affiliation
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctOption: { type: String, required: true },
    difficulty_level: { type: String, required: true },
    created_by: { type: String, required: true },
    explanation: { type: String },
    typology: { 
      type: String, 
      enum: ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Hots', 'critical Thinking', 'creative thinking', 'create'],
      required: true
    },
    question_type: { 
      type: String,
      enum: ['MCQ', 'Subjective', 'True/False', 'Fill in the Blanks', 'Match the Following', 'Assertion and Reasoning', 'Case Study', 'Passage Based'],
      required: true
    },
    weightage: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    createdDate: { type: Date, default: Date.now },
    modified_BY: { type: String },
    modified_date: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", QuestionSchema);
