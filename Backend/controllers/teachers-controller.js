const teacherModels = require('../models/teacher-models');
const { get } = require('../routes/teachers-routes');

// const UploadStudyMaterial = async (req, res) => {
//     try {
//         const { category, course } = req.body;
//         const {teacherId} = req.params;
//         const files = req.files; // Files are in req.files with multer

//         // Validate input
//         if (!category || !course || !teacherId) {
//             return res.status(400).json({ message: 'Category, course, and teacherId are required.' });
//         }

//         if (!files || files.length === 0) {
//             return res.status(400).json({ message: 'At least one file is required.' });
//         }

//         // Upload to Google Cloud Storage
//         const result = await teacherModels.UploadStudyMaterial(category, course, files, teacherId);

//         // Check if upload was successful
//         if (result && result.success) {
//             res.status(201).json({
//                 message: `Study material uploaded successfully. ${files.length} file(s) uploaded.`,
//                 success: true,
//                 filesUploaded: files.length
//             });
//         } else {
//             return res.status(500).json({
//                 message: 'Failed to upload study materials.',
//                 success: false
//             });
//         }
//     } catch (error) {
//         console.error('Error uploading study material:', error);
//         res.status(500).json({ message: 'Internal server error: ' + error.message });
//     }
// };

// const getStudyMaterials = async (req, res) => {
//     try {
//         const { category, course } = req.query;

//         // If category or course is 'All' or empty, fetch all materials
//         const fetchAll = !category || !course || category === 'All' || course === 'All';

//         const materials = await teacherModels.getStudyMaterials(fetchAll ? null : category, fetchAll ? null : course);

//         if (!materials || materials.length === 0) {
//             return res.status(404).json({ message: 'No study materials found.' });
//         }

//         res.status(200).json({
//             message: 'Study materials retrieved successfully.',
//             materials
//         });
//     } catch (error) {
//         console.error('Error retrieving study materials:', error);
//         res.status(500).json({ message: 'Internal server error: ' + error.message });
//     }
// };

const deleteStudyMaterial = async (req, res) => {
  try {
    const { fileName } = req.body;

    if (!fileName) {
      return res.status(400).json({ message: 'File name is required for deletion.' });
    }

    await teacherModels.deleteStudyMaterial(fileName);

    res.status(200).json({ message: 'Study material deleted successfully.' });
  } catch (error) {
    console.error('Error deleting study material:', error);
    res.status(500).json({ message: 'Internal server error: ' + error.message });
  }
};

// const getAllStudentsCount = async (req, res) => {
//     try {
//         const students = await teacherModels.getAllStudentsCount();
//         res.status(200).json({
//             message: 'Students retrieved successfully.',
//             students
//         });
//     } catch (error) {
//         console.error('Error retrieving students:', error);
//         res.status(500).json({ message: 'Internal server error: ' + error.message });
//     }
// };

module.exports = {
    // UploadStudyMaterial,
    // getStudyMaterials,
    deleteStudyMaterial,
    // getAllStudentsCount,
    // getAllUploadedMaterialscount
};


const teacher_controller = {

    getAllStudentsCount: async (req, res) => {
        try {
            const students = await teacherModels.getAllStudentsCount();
            res.status(200).json({
                message: 'Students retrieved successfully.',
                students
            });
        } catch (error) {
            console.error('Error retrieving students:', error);
            res.status(500).json({ message: 'Internal server error: ' + error.message });
        }
    },
    getAllUploadedMaterialscount: async (req, res) => {

        const teacherId = req.params.teacherId;

        if (!teacherId) {
            return res.status(400).json({ message: 'teacherId is required.' });
        }
        try {
            const materials = await teacherModels.getAllUploadedMaterialscount(teacherId);
            res.status(200).json({
                message: 'Uploaded materials count retrieved successfully.',
                materials
            });
        } catch (error) {
            console.error('Error retrieving uploaded materials count:', error);
            res.status(500).json({ message: 'Internal server error: ' + error.message });
        }
    },

    UploadStudyMaterial: async (req, res) => {
        try {
            const { category, course } = req.body;
            const { teacherId } = req.params;
            const files = req.files; // Files are in req.files with multer

            // Validate input
            if (!category || !course || !teacherId) {
                return res.status(400).json({ message: 'Category, course, and teacherId are required.' });
            }

            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'At least one file is required.' });
            }

            // Upload to Google Cloud Storage
            const result = await teacherModels.UploadStudyMaterial(category, course, files, teacherId);

            // Check if upload was successful
            if (result && result.success) {
                res.status(201).json({
                    message: `Study material uploaded successfully. ${files.length} file(s) uploaded.`,
                    success: true,
                    filesUploaded: files.length
                });
            } else {
                return res.status(500).json({
                    message: 'Failed to upload study materials.',
                    success: false
                });
            }
        } catch (error) {
            console.error('Error uploading study material:', error);
            res.status(500).json({ message: 'Internal server error: ' + error.message });
        }
    },

    getStudyMaterials: async (req, res) => {
        try {
            const { teacherId } = req.params;;  // Get teacherId from query params
            const materials = await teacherModels.getAllStudyMaterials(teacherId);
            res.status(200).json({ message: 'Study materials retrieved successfully.', materials });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error: ' + error.message });
        }
    },

    deleteStudyMaterial: async (req, res) => {
        try {
            const { fileName } = req.body;

            if (!fileName) {
                return res.status(400).json({ message: 'File name is required for deletion.' });
            }

            await teacherModels.deleteStudyMaterial(fileName);

            res.status(200).json({ message: 'Study material deleted successfully.' });
        } catch (error) {
            console.error('Error deleting study material:', error);
            res.status(500).json({ message: 'Internal server error: ' + error.message });
        }
    },

    getAllstudentInfo: async (req, res) => {
        try {
            const students = await teacherModels.getAllstudentInfo();
            res.status(200).json({
                message: 'Students retrieved successfully.',
                data: students
            });
        } catch (error) {
            console.error('Error retrieving students:', error);
            res.status(500).json({ message: 'Internal server error: ' + error.message });
        }
    },

  getAttendanceByDateAndClass: async (req, res) => {
    try {
      const { date, class: className } = req.query;
      const attendanceData = await teacherModels.getAttendanceByDateAndClass(date, className);
      res.status(200).json({
        message: 'Attendance data retrieved successfully.',
        data: attendanceData
      });
    } catch (error) {
      console.error('Error retrieving attendance data:', error);
      res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
  },

  saveAttendance: async (req, res) => {
    try {
      const { date, class: className, teacherId, records } = req.body;

      // Validate required fields
      if (!date || !className || !teacherId || !records) {
        return res.status(400).json({ message: 'Date, class, teacherId, and records are required.' });
      }

      // Transform records to match database schema
      const attendanceRecords = records.map(record => ({
        date,
        class: className,
        teacher_id: teacherId,
        student_id: record.studentId,
        status: record.status
      }));

      const result = await teacherModels.saveAttendance(attendanceRecords);

      res.status(201).json({
        message: 'Attendance saved successfully.',
        data: result
      });
    } catch (error) {
      console.error('Error saving attendance:', error);
      res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
  },

  getAttendanceRecords: async (req, res) => {
    try {
      const { teacherId } = req.params;
      const { startDate, endDate } = req.query;

      if (!teacherId) {
        return res.status(400).json({ message: 'teacherId is required.' });
      }

      const attendanceRecords = await teacherModels.getAttendanceRecords(teacherId, startDate, endDate);

      res.status(200).json({
        message: 'Attendance records retrieved successfully.',
        data: attendanceRecords
      });
    } catch (error) {
      console.error('Error retrieving attendance records:', error);
      res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
  }
};

module.exports = teacher_controller;