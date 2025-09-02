const express = require('express');
const router = express.Router();
const multer = require('multer');

const { UploadStudyMaterial,  getStudyMaterials, deleteStudyMaterial} = require('../controllers/teachers-controller');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Temporary storage

// Route with file upload middleware
router.post('/UploadStudyMaterial/:teacherId', upload.array('files'), UploadStudyMaterial);

router.get('/getStudyMaterials', getStudyMaterials);

router.delete('/deleteStudyMaterial', deleteStudyMaterial);

module.exports = router;

