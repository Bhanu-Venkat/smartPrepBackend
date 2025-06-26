const AssessmentHistory = require('../models/assessmentHistory');
const BluePrint = require('../models/bluePrint');
const TestTemplate = require('../models/testTemplate');
const Question = require('../models/questions'); // Assuming you have a question model

exports.createAssessment = async (req, res) => {
  try {

    const { subjectId, topicId, subject, topics, level } = req.body;

    // 1. Get blueprint by subjectId and level
    let bluePrint = await BluePrint.findOne({ subjectId, blueprintName: level });
    // console.log("Blueprint fetched:", bluePrint);
    // 2. If not found, fallback to generic blueprint
    if (!bluePrint) {
      bluePrint = await BluePrint.findOne({ subjectId: null, level });
      // console.log("Fallback blueprint fetched:", bluePrint);
      if (!bluePrint) return res.status(404).json({ message: 'No blueprint found for level.' });
    }

    // 3. Get test template by blueprintId
    const testTemplate = await TestTemplate.findOne({ blueprintId: bluePrint._id });
    // console.log("Test template fetched:", testTemplate);
    if (!testTemplate) return res.status(404).json({ message: 'No test template found.' });

    // 4. Get assessment history by subject, topics, and level
    const history = await AssessmentHistory.find({
      subject,
      topic: { $in: topics },
      assessmentLevel: level
    });
    // console.log("Assessment history fetched:", history);

    // 5. Get all previously correctly answered questionIds
    const correctAnswered = new Set();
    if (history.length > 0) {
      history.forEach(h => {
        h.correctAttemptQuestions.forEach(q => correctAnswered.add(q));
      });
      // console.log("Correctly answered questions:", Array.from(correctAnswered));
    }

    // 6. Construct assessment object
    const sections = [];

    for (const section of testTemplate.sections) {
      // console.log("Processing section:", section);
      const sectionQuestions = [];

      for (const typologyConfig of bluePrint.typologies) {
        // console.log("Processing typology config:", typologyConfig);
        const { typology, marksDistribution } = typologyConfig;
        const { noOfQuestions } = marksDistribution[0];
        // console.log("the num of questions to fetch:", noOfQuestions);
        // 7. Fetch questions of this typology and section not in correctAnswered set
        const questions = await Question.find({
          topic: { $in: topicId },
          typology,
          _id: { $nin: Array.from(correctAnswered) }
        }).limit(noOfQuestions);
        // console.log("Questions fetched for typology:", questions);

        sectionQuestions.push(...questions);
      }

      // console.log("Section questions constructed:", sectionQuestions);
      sections.push({
        sectionName: section.sectionText,
        questions: sectionQuestions
      });
    }

    // console.log("Sections constructed:", sections);

    // Final assessment response
    const assessmentResponse = {
      testTemplate,
      bluePrint,
      totalTime: testTemplate.totalTime,
      testTemplatedetails: testTemplate.details,
      sections
    };

    // console.log("Final assessment response:", assessmentResponse);
    res.status(200).json({ assessment: assessmentResponse });

  } catch (err) {
    console.error('Error creating assessment:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createAssessmentController = async (payload) => {
  try {

    const { subjectId, topicId, subject, topics, level } = payload;

    // 1. Get blueprint by subjectId and level
    let bluePrint = await BluePrint.findOne({ subjectId, blueprintName: level });
    // console.log("Blueprint fetched:", bluePrint);
    // 2. If not found, fallback to generic blueprint
    if (!bluePrint) {
      bluePrint = await BluePrint.findOne({ subjectId: null, level });
      // console.log("Fallback blueprint fetched:", bluePrint);
      if (!bluePrint) return res.status(404).json({ message: 'No blueprint found for level.' });
    }

    // 3. Get test template by blueprintId
    const testTemplate = await TestTemplate.findOne({ blueprintId: bluePrint._id });
    // console.log("Test template fetched:", testTemplate);
    if (!testTemplate) return res.status(404).json({ message: 'No test template found.' });

    // 4. Get assessment history by subject, topics, and level
    const history = await AssessmentHistory.find({
      subject,
      topic: { $in: topics },
      assessmentLevel: level
    });
    // console.log("Assessment history fetched:", history);

    // 5. Get all previously correctly answered questionIds
    const correctAnswered = new Set();
    if (history.length > 0) {
      history.forEach(h => {
        h.correctAttemptQuestions.forEach(q => correctAnswered.add(q));
      });
      // console.log("Correctly answered questions:", Array.from(correctAnswered));
    }

    // 6. Construct assessment object
    const sections = [];

    for (const section of testTemplate.sections) {
      // console.log("Processing section:", section);
      const sectionQuestions = [];

      for (const typologyConfig of bluePrint.typologies) {
        // console.log("Processing typology config:", typologyConfig);
        const { typology, marksDistribution } = typologyConfig;
        const { noOfQuestions } = marksDistribution[0];
        // console.log("the num of questions to fetch:", noOfQuestions);
        // 7. Fetch questions of this typology and section not in correctAnswered set
        const questions = await Question.find({
          topic: { $in: topicId },
          typology,
          _id: { $nin: Array.from(correctAnswered) }
        }).limit(noOfQuestions);
        // console.log("Questions fetched for typology:", questions);

        sectionQuestions.push(...questions);
      }

      // console.log("Section questions constructed:", sectionQuestions);
      sections.push({
        sectionName: section.sectionText,
        questions: sectionQuestions
      });
    }

    // console.log("Sections constructed:", sections);

    // Final assessment response
    const assessmentResponse = {
      testTemplate,
      bluePrint,
      totalTime: testTemplate.totalTime,
      testTemplatedetails: testTemplate.details,
      sections
    };

    // // console.log("Final assessment response:", assessmentResponse);
    // res.status(200).json({ assessment: assessmentResponse });
    return assessmentResponse;

  } catch (err) {
    console.error('Error creating assessment:', err);
    // res.status(500).json({ error: 'Internal Server Error' });
    return { error: 'Internal Server Error' };
  }
};