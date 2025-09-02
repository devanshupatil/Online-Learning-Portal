const leranersModels = require('../models/leraner-models');

const getStudyMaterials = async (req, res) => {
    try {
        const { learnerId } = req.params;

        if (!learnerId) {
            return res.status(400).json({ message: 'learnerId is required.' });
        }

        const studyMaterials = await leranersModels.getStudyMaterials(learnerId);

        if (!studyMaterials) {
            return res.status(404).json({ message: "No study materials found for this learner." });
        }

        res.status(200).json({
            message: 'Study materials retrieved successfully.',
            studyMaterials: studyMaterials
        });
    } catch (error) {
        console.error('Error retrieving study materials:', error);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
};

module.exports = {
    getStudyMaterials
};