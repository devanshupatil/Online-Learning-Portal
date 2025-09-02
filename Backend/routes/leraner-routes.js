const express = require('express');
const router = express.Router();

const { getStudyMaterials } = require('../controllers/leraners-controller');


router.get('/studyMaterials/:learnerId', getStudyMaterials);


module.exports = router;
