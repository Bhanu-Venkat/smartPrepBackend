const csv = require("fast-csv");
const Question = require("../models/questions");

exports.bulkUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    const { affiliation, standard, subject, topic } = req.body;
    // if (!affliation || !standard || !subject || !topic) {
    //   return res.status(400).json({ message: "All parameters are required" });
    // }
    console.log("the affiliation: ",affiliation, topic)

    let questions = [];
    let errors = [];

    csv.parseString(req.file.buffer.toString(), { headers: true })
      .on("data", (row) => {
        if (
          !row.question || !row.options || !row.correctOption ||
          !row.difficulty_level || !row.typology ||
          isNaN(row.weightage) || (row.isActive.toUpperCase() !== "TRUE" && row.isActive.toUpperCase() !== "FALSE")
        ) {
          console.error("Invalid row:", row);
          console.log("the considtion check: ", !row.question || !row.options || !row.correctOption ||
            !row.difficulty_level || !row.typology ||
            isNaN(row.weightage) || (row.isActive !== "true" && row.isActive !== "false"))
          errors.push(row);
        } else {
          questions.push({
            affiliation,
            topic,
            question: row.question,
            options: row.options.split("|"),
            correctOption: row.correctOption,
            difficulty_level: row.difficulty_level,
            created_by: "admin", // Replace with dynamic user info
            typology: row.typology,
            question_type: row.question_type,
            weightage: Number(row.weightage),
            isActive: row.isActive === "true",
          });
        }
      })
      .on("end", async () => {
        if (questions.length > 0) {
          var response = await Question.insertMany(questions);
          console.log("Bulk upload response:", response);
        }

        res.status(200).json({
          message: "Bulk upload completed",
          successCount: questions.length,
          errorCount: errors.length,
          errors,
        });
      });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
