const express = require('express');
const router = express.Router();

const { getStudyMaterials, getAllTextAnalysis } = require('../controllers/student-controller');
const { getAttendanceByDateAndClass, saveAttendance, getStudentInfo, getStudentAttendanceSummary } = require('../controllers/student-controller');

router.get('/studyMaterials/:learnerId', getStudyMaterials);

router.get('/textAnalysis', getAllTextAnalysis);

// // Routes for student information (for teacher dashboard)
// router.get('/attendance', getAttendanceByDateAndClass); // Get attendance by date and class
// router.post('/attendance', saveAttendance); // Save attendance
// router.get('/students', getStudentInfo); // Get all students
// router.get('/students/:studentId', getStudentInfo); // Get specific student
// router.get('/students/:studentId/attendance-summary', getStudentAttendanceSummary);

module.exports = router;
