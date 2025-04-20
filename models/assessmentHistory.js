// models/assessmentHistory.model.js

const mongoose = require('mongoose');

const assessmentHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    class: {
        type: String,
            required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
    assessmentLevel:{
        type: String,
        required: true,
    },
    assessmentType: {
        type: String,
        required: true,
    },
    correctAttemptQuestions: {
        type: [String],
        default: [],
    },
    wrongAttemptedQuestions: {
        type: [String],
        default: [],
    },
    securedScore: {
        type: Number,
        required: true,
    },
    totalScore: {
        type: Number,
        required: true,
    },
    totalQuestions: {
        type: Number,
        required: true,
    },
    // timeTaken: {
    //     type: Number,
    //     required: true,
    // },
    dateOfAssessment: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Completed', 'In Progress', 'Not Attempted'],
        default: 'Not Attempted',
    },
    userAnswers: {
        type: [{
            questionId: String,
            answer: String,
        }],
        default: [],
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AssessmentHistory', assessmentHistorySchema);