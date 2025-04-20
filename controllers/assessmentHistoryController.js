// controllers/assessmentHistory.controller.js

const AssessmentHistory = require('../models/assessmentHistory');

// CREATE a new assessment history record
exports.createAssessmentRecord = async (req, res) => {
  try {
    const {
      userId,
      class: userClass,
      subject,
      topic,
      assessmentType,
      correctAttemptQuestions,
      wrongAttemptedQuestions,
      securedScore,
      totalScore,
      totalQuestions,
      // timeTaken,
      dateOfAssessment,
      status,
      userAnswers,
      assessmentId,
      assessmentLevel
    } = req.body;

    const newRecord = new AssessmentHistory({
      userId,
      class: userClass,
      subject,
      topic,
      assessmentType,
      assessmentLevel,
      correctAttemptQuestions,
      wrongAttemptedQuestions,
      securedScore,
      totalScore,
      totalQuestions,
      // timeTaken,
      dateOfAssessment,
      status,
      userAnswers,
      assessmentId
    });

    await newRecord.save();

    res.status(201).json({
      message: 'Assessment record created successfully.',
      data: newRecord
    });
  } catch (error) {
    console.error('Error creating assessment record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET records by userId and optional filters
exports.getAssessmentHistoryByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const queryFilters = { userId };

    // Optional query params
    if (req.query.subject) queryFilters.subject = req.query.subject;
    if (req.query.topic) queryFilters.topic = req.query.topic;
    if (req.query.assessmentType) queryFilters.assessmentType = req.query.assessmentType;
    if (req.query.status) queryFilters.status = req.query.status;
    if(req.query.assessmentLevel) queryFilters.assessmentLevel = req.query.assessmentLevel; 
    // if (req.query.assessmentId) queryFilters.assessmentId = req.query.assessmentId;

    const records = await AssessmentHistory.find(queryFilters).sort({ createdAt: -1 });

    res.status(200).json({ data: records });
  } catch (error) {
    console.error('Error fetching assessment history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
