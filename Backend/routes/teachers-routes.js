const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../config/supabaseDB')

const { UploadStudyMaterial, getStudyMaterials, deleteStudyMaterial, getAllStudentsCount
, getAllUploadedMaterialscount
 } = require('../controllers/teachers-controller');


// Configure multer for file uploads (use memory storage to access file.buffer)
const upload = multer({ storage: multer.memoryStorage() });


router.get('/getStudyMaterials/:teacherId', getStudyMaterials);

// router.delete('/deleteStudyMaterial', deleteStudyMaterial);

router.get('/getAllStudentcount', getAllStudentsCount);

router.get('/getAllUploadedMaterialscount/:teacherId', getAllUploadedMaterialscount);

router.post('/UploadStudyMaterial/:teacherId', upload.array('files'), UploadStudyMaterial);

router.get('/getFile/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('study_materials')
            .select('file_data, mime_type, file_name')
            .eq('id', id)
            .single();

        if (error || !data) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Prevent caching
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        // Set content headers
        res.setHeader('Content-Type', data.mime_type || 'application/octet-stream');
        res.setHeader('Content-Disposition', `inline; filename="${data.file_name}"`);

        // Send binary data
        res.send(data.file_data);
    } catch (err) {
        console.error('Error serving file:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});





module.exports = router;

