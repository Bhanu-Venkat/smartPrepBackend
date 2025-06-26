const mongoose = require('mongoose');

const multiChapterSelectionSchema = new mongoose.Schema({
  assessment_type: { type: String, enum: ['MULTI_CHAPTER_ONLINE', 'MULTI_CHAPTER_OFFLINE'], required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  subjectName: { type: String, required: true },
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isOffline: { type: Boolean, default: false },
  timestamp: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  expireTime: { type: Date },
  numberOfAttempts: { type: Number, default: 0 },
});

module.exports = mongoose.model('MultiChapterSelection', multiChapterSelectionSchema);
