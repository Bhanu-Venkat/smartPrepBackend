const Affiliation = require('../models/affiliationModel');

const createAffiliation = async (req, res) => {
    try {
        const { affiliation, standard, createdBy } = req.body;
        const newAffiliation = new Affiliation({ affiliation, standard, createdBy });
        const savedAffiliation = await newAffiliation.save();
        res.status(201).json({ message: 'Affiliation created successfully', data: savedAffiliation });
    } catch (error) {
        res.status(500).json({ message: 'Error creating affiliation', error: error.message });
    }
};

const modifyAffiliation = async (req, res) => {
    try {
        const { affiliationId, add, modify, disable } = req.body;
        const { modifiedBy } = req.user;

        const affiliation = await Affiliation.findById(affiliationId);
        if (!affiliation) return res.status(404).json({ message: 'Affiliation not found' });

        if (add) {
            if (add.topic?.length) {
                add.topic.forEach(topic => {
                    affiliation.standard.forEach(grade => {
                        grade.subjects.forEach(subject => {
                            subject.chapters.forEach(chapter => {
                                if (chapter.unitId.toString() === topic.unitId) {
                                    chapter.topics.push({
                                        topicName: topic.topicName,
                                        isActive: topic.isActive ?? true,
                                        rules: topic.rules
                                    });
                                }
                            });
                        });
                    });
                });
            }

            if (add.chapter?.length) {
                add.chapter.forEach(chapter => {
                    affiliation.standard.forEach(grade => {
                        grade.subjects.forEach(subject => {
                            if (subject.subjectId.toString() === chapter.subjectId) {
                                subject.chapters.push({
                                    unitName: chapter.unitName,
                                    isActive: chapter.isActive ?? true,
                                    topics: chapter.topics || []
                                });
                            }
                        });
                    });
                });
            }

            if (add.subject?.length) {
                add.subject.forEach(subject => {
                    affiliation.standard.forEach(grade => {
                        if( grade.gradeId.toString() === subject.gradeId) {
                            grade.subjects.push({
                                subjectName: subject.subjectName,
                                chapters: subject.chapters || []
                            });
                        }
                    });
                });
            }

            if(add.standard?.length){
                add.standard.forEach(standard => {
                    affiliation.standard.push({
                        grade: standard.grade,
                        subjects: standard.subjects
                    });
                })
            }
        }

        if (modify) {
            if (modify.topic?.length) {
                modify.topic.forEach(topicUpdate => {
                    affiliation.standard.forEach(grade => {
                        grade.subjects.forEach(subject => {
                            subject.chapters.forEach(chapter => {
                                chapter.topics.forEach(topic => {
                                    if (topic.topicId.toString() === topicUpdate.topicId) {
                                        topic.topicName = topicUpdate.modifiedTopicName;
                                    }
                                });
                            });
                        });
                    });
                });
            }

            if (modify.chapter?.length) {
                modify.chapter.forEach(chapterUpdate => {
                    affiliation.standard.forEach(grade => {
                        grade.subjects.forEach(subject => {
                            subject.chapters.forEach(chapter => {
                                if (chapter.unitId.toString() === chapterUpdate.chapterId) {
                                    chapter.unitName = chapterUpdate.modifiedChapterName;
                                }
                            });
                        });
                    });
                });
            }

            if (modify.subject?.length) {
                modify.subject.forEach(subjectUpdate => {
                    affiliation.standard.forEach(grade => {
                        grade.subjects.forEach(subject => {
                            if (subject.subjectId.toString() === subjectUpdate.subjectId) {
                                subject.subjectName = subjectUpdate.modifiedSubjectName;
                            }
                        });
                    });
                });
            }

            if(modify.standard?.length){
                modify.standard.forEach(standardUpdate => {
                    affiliation.standard.forEach(grade => {
                        if (grade.gradeId.toString() === standardUpdate.gradeId) {
                            grade.grade = standardUpdate.modifiedGrade;
                        }
                    });
                });
            }
        }

        if (disable) {
            if (disable.topic?.length) {
                affiliation.standard.forEach(grade => {
                    grade.subjects.forEach(subject => {
                        subject.chapters.forEach(chapter => {
                            chapter.topics.forEach(topic => {
                                if (disable.topic.includes(topic.topicId.toString())) {
                                    topic.isActive = false;
                                }
                            });
                        });
                    });
                });
            }

            if (disable.chapter?.length) {
                affiliation.standard.forEach(grade => {
                    grade.subjects.forEach(subject => {
                        subject.chapters.forEach(chapter => {
                            if (disable.chapter.includes(chapter.unitId.toString())) {
                                chapter.isActive = false;
                            }
                        });
                    });
                });
            }

            if (disable.subject?.length) {
                affiliation.standard.forEach(grade => {
                    grade.subjects.forEach(subject => {
                        if (disable.subject.includes(subject.subjectId.toString())) {
                            subject.isActive = false;
                        }
                    });
                });
            }
        }

        affiliation.modifiedBy = modifiedBy;
        affiliation.modifiedDate = new Date();
        await affiliation.save();

        res.status(200).json({ message: 'Affiliation modified successfully', data: affiliation });
    } catch (error) {
        res.status(500).json({ message: 'Error modifying affiliation', error: error.message });
    }
};

const getAffiliationById = async (req,res) => {
    const {affiliationId} = req.params;
    try {
        const affiliation = await Affiliation.findOne({affiliation: affiliationId});
        if (!affiliation) return res.status(404).json({ message: 'Affiliation not found' });
        res.status(200).json({ data: affiliation });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching affiliation', error: error.message });
    }
}

const getGradeByAffiliation = async (req,res) => {
    const { affiliation, grade } = req.params;

    try {
        // Fetch the data based on affiliation and grade
        const data = await Affiliation.findOne({
            affiliation: affiliation,
            'standard.grade': grade
        }, {
            'standard.$': 1 // Project only the matching grade's data
        });

        if (!data) {
            return res.status(404).json({ message: 'No data found for the specified grade and affiliation.' });
        }

        res.status(200).json({ data });
    } catch (error) {
        console.error('Error fetching grade data:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = { createAffiliation, modifyAffiliation, getAffiliationById, getGradeByAffiliation };
