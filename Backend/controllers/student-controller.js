const studentModels = require('../models/student-models');

const getAttendanceByDateAndClass = async (req, res) => {
    try {
        const { date, class: className } = req.query;

        if (!date || !className) {
            return res.status(400).json({ message: 'Date and class are required.' });
        }

        const attendanceRecords = await studentModels.getAttendanceByDateAndClass(date, className);

        res.status(200).json({
            message: 'Attendance records retrieved successfully.',
            data: attendanceRecords
        });
    } catch (error) {
        console.error('Error retrieving attendance records:', error);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
};

const saveAttendance = async (req, res) => {
    try {
        const attendanceData = req.body;

        // Validate required fields
        if (!attendanceData.date || !attendanceData.records) {
            return res.status(400).json({ message: 'Date and attendance records are required.' });
        }

        const result = await studentModels.saveAttendance(attendanceData);

        res.status(200).json({
            message: result.message,
            data: result
        });
    } catch (error) {
        console.error('Error saving attendance:', error);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
};

const getStudentInfo = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Validate studentId if provided
        if (studentId && isNaN(studentId)) {
            return res.status(400).json({ message: 'Invalid student ID. Must be a number.' });
        }

        const studentInfo = await studentModels.getStudentInfo(studentId);

        if (!studentInfo || studentInfo.length === 0) {
            return res.status(404).json({ message: 'No student information found.' });
        }

        res.status(200).json({
            message: 'Student information retrieved successfully.',
            data: studentInfo
        });
    } catch (error) {
        console.error('Error retrieving student information:', error);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
};

const getStudentAttendanceSummary = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!studentId || isNaN(studentId)) {
            return res.status(400).json({ message: 'Valid student ID is required.' });
        }

        const summary = await studentModels.getStudentAttendanceSummary(studentId);

        res.status(200).json({
            message: 'Student attendance summary retrieved successfully.',
            data: summary
        });
    } catch (error) {
        console.error('Error retrieving student attendance summary:', error);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
};

module.exports = {
    getAttendanceByDateAndClass,
    saveAttendance,
    getStudentInfo,
    getStudentAttendanceSummary
};