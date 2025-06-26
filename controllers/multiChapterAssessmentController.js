const MultiChapterSelection = require('../models/multiChapterSelection');
const CustomAssessment = require('../models/customAssessment');
const Affiliation = require('../models/affiliationModel'); // Assuming this model exists
const { createAssessment, createAssessmentController } = require('../controllers/assessmentController'); // Assuming existing createAssessment
const { default: mongoose, Types } = require('mongoose');
const BluePrint = require('../models/bluePrint');
const TestTemplate = require('../models/testTemplate');

exports.createMultiChapterAssessment = async (req, res) => {
  try {
    const {
      assessment_type,
      subject,
      subjectName,
      chapters,
      createdBy,
      assignedTo,
      isOffline = false
    } = req.body;

    const now = new Date();
    const expireTime = new Date(now.getTime() + (48 * 60 * 60 * 1000)); // 48 hours

    // 1. Save to multi_chapter_selection
    const multiChapterDoc = await MultiChapterSelection.create({
      assessment_type,
      subject,
      subjectName,
      chapters,
      createdBy,
      assignedTo,
      isOffline,
      timestamp: { createdAt: now, updatedAt: now },
      expireTime,
      numberOfAttempts: 0
    });

    // 2. Get topics from affiliation
    // console.log('Fetching topics for chapters:', chapters);
    const unitIds = chapters.map(id => new Types.ObjectId(id));
    // console.log('Unit IDs:', unitIds);

    const topicsData = await Affiliation.aggregate([
  { $unwind: "$standard" },
  { $unwind: "$standard.subjects" },
  { $unwind: "$standard.subjects.chapters" },
  {
    $match: {
      "standard.subjects.chapters.unitId": { $in: unitIds },
      "standard.subjects.chapters.isActive": true
    }
  },
  { $unwind: "$standard.subjects.chapters.topics" },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [
          "$standard.subjects.chapters.topics",
          {
            unitName: "$standard.subjects.chapters.unitName",
            subjectName: "$standard.subjects.subjectName",
            grade: "$standard.grade"
          }
        ]
      }
    }
  }
]);
    

    // console.log('Topics fetched from affiliation:', topicsData);
    const topicIds = topicsData.map(t => t.topicId);
    const topicNames = topicsData.map(t => t.topicName);



    // 3. Prepare payload for createAssessment
    const payload = {
      subjectId: subject,
      topicId: topicIds,
      subject: subjectName,
      topics: topicNames,
      level: isOffline ? 'OFFLINE_ASSESSMENT' : 'MULTI_CHAPTER_ASSESSMENT'
    };

    // console.log('Payload for createAssessment:', payload);
    // 4. Invoke createAssessment
    const createAssessmentResponse = await createAssessmentController(payload);
    // if(true) {
    //   res.status(201).json({
    //     createAssessmentResponse
    //   })
    // }
    console.log('Assessment created:', JSON.stringify(createAssessmentResponse));

    // 5. Save response to customAssessment
    const customAssessmentDoc = await CustomAssessment.create({
      assessment: {
        totalTime: createAssessmentResponse.totalTime,
        sections: createAssessmentResponse.sections,
        testTemplate: JSON.stringify(createAssessmentResponse.testTemplate),
        bluePrint: JSON.stringify(createAssessmentResponse.bluePrint),
      }
    });

    // 6. Send Response
    if (createdBy.toString() !== assignedTo.toString()) {
      
      return res.status(201).json({
        message: "Assessment created successfully and notified to student."
      });
    } else {
      return res.status(201).json({
        customAssessmentId: customAssessmentDoc._id,
        message: "Assessment created successfully."
      });
    }
  } catch (error) {
    console.error('Error in createMultiChapterAssessment', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getMultiChapterAssessments = async (req, res) => {
  try {
    const { fieldName, fieldValue } = req.params;

    // Validate allowed field names
    if (!['createdBy', 'assignedTo'].includes(fieldName)) {
      return res.status(400).json({ message: "Invalid field name. Must be 'createdBy' or 'assignedTo'." });
    }

    // Build dynamic query
    const query = { [fieldName]: fieldValue };

    // Fetch assessments
    const assessments = await MultiChapterSelection.find(query)
      .populate('subject', 'name') // Optional: populate subject if needed
      .populate('chapters', 'name') // Optional: populate chapter details
      .populate('createdBy', 'name') // Optional: populate createdBy name
      .populate('assignedTo', 'name') // Optional: populate assignedTo name
      .lean();

    return res.status(200).json({
      count: assessments.length,
      data: assessments
    });

  } catch (error) {
    console.error('Error in getMultiChapterAssessments:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getCustomAssessmentById = async (req, res) => {
  try {
    console.log('Fetching custom assessment by ID:', req.params.id);
    const { id } = req.params;

    // Validate the id (basic MongoDB ObjectId format check)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid assessment ID format." });
    }

    let assessment = await CustomAssessment.findById(id).lean();
    console.log('Fetched custom assessment:', JSON.stringify(assessment));
    // console.log('Fetched custom assessment:', typeof assessment.assessment.testTemplateId, typeof assessment.assessment.bluePrintId);
    // const testTemplateId = assessment.assessment.testTemplateId;

    // If it's a string
    // const ttid = typeof testTemplateId === 'string' ? new ObjectId(testTemplateId) : testTemplateId;
    // console.log('Converted test template ID:', ttid);
    // const TestTemplateData = await TestTemplate.findById(ttid).lean();
    // console.log('Fetched test template:', TestTemplateData);
    // const BluePrintData = await BluePrint.findById(assessment.assessment.bluePrintId).lean();
    // console.log('Fetched blueprint:', BluePrintData);
    assessment.assessment.testTemplate = JSON.parse(assessment.assessment.testTemplate);
    assessment.assessment.bluePrint = JSON.parse(assessment.assessment.bluePrint);
    // assessment.assessment.testTemplateId = undefined;
    // assessment.assessment.bluePrintId = undefined;

    if (!assessment) {
      return res.status(404).json({ message: "Custom assessment not found." });
    }

    return res.status(200).json({
      message: "Custom assessment fetched successfully.",
      data: assessment.assessment
    });

  } catch (error) {
    console.error('Error in getCustomAssessmentById:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

