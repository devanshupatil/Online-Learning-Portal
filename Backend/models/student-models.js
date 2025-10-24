// const getPool = require('../postgresDB');

// // Create teachers table if it doesn't exist
// // const createTeachersTable = async () => {
// //     try {
// //         const query = `
// //             CREATE TABLE IF NOT EXISTS teachers (
// //                 id SERIAL PRIMARY KEY,
// //                 name VARCHAR(255) NOT NULL,
// //                 email VARCHAR(255) UNIQUE,
// //                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// //             )
// //         `;
// //         await pool.query(query);

// //         // Insert default teacher if not exists
// //         const insertQuery = `
// //             INSERT INTO teachers (id, name, email)
// //             VALUES (1, 'John Smith', 'john.smith@school.com')
// //             ON CONFLICT (id) DO NOTHING
// //         `;
// //         await pool.query(insertQuery);
// //     } catch (error) {
// //         console.error('Error creating teachers table:', error);
// //     }
// // };

// // // Initialize teachers table
// // createTeachersTable();

// // // Create attendance table with teacher_id if it doesn't exist
// // const createAttendanceTable = async () => {
// //     try {
// //         const query = `
// //             CREATE TABLE IF NOT EXISTS attendance (
// //                 id SERIAL PRIMARY KEY,
// //                 student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
// //                 date DATE NOT NULL,
// //                 status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
// //                 class VARCHAR(50),
// //                 teacher_id INTEGER REFERENCES teachers(id),
// //                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// //                 UNIQUE(student_id, date)
// //             )
// //         `;
// //         await pool.query(query);

// //         // Add teacher_id column if it doesn't exist (for existing tables)
// //         const alterQuery = `
// //             ALTER TABLE attendance
// //             ADD COLUMN IF NOT EXISTS teacher_id INTEGER REFERENCES teachers(id)
// //         `;
// //         await pool.query(alterQuery);
// //     } catch (error) {
// //         console.error('Error creating/updating attendance table:', error);
// //     }
// // };

// // // Initialize attendance table
// // createAttendanceTable();

// const getStudentInfo = async (studentId = null) => {
//     try {
//         let query;
//         let params = [];

//         if (studentId) {
//             // Get specific student with attendance
//             query = `
//                 SELECT
//                     s.id as student_id,
//                     s.name,
//                     s.class,
//                     s.grade,
//                     s.email,
//                     s.phone,
//                     s.parent_phone,
//                     s.parent_name,
//                     s.parent_email,
//                     s.address,
//                     a.id as attendance_id,
//                     a.date,
//                     a.status,
//                     a.class as attendance_class
//                 FROM students s
//                 LEFT JOIN attendance a ON s.id = a.student_id
//                 WHERE s.id = $1
//                 ORDER BY a.date DESC
//             `;
//             params = [studentId];
//         } else {
//             // Get all students with their latest attendance
//             query = `
//                 SELECT
//                     s.id as student_id,
//                     s.name,
//                     s.class,
//                     s.grade,
//                     s.email,
//                     s.phone,
//                     s.parent_phone,
//                     s.parent_name,
//                     s.parent_email,
//                     s.address,
//                     a.date as last_attendance_date,
//                     a.status as last_attendance_status
//                 FROM students s
//                 LEFT JOIN attendance a ON s.id = a.student_id
//                 AND a.date = (
//                     SELECT MAX(date)
//                     FROM attendance
//                     WHERE student_id = s.id
//                 )
//                 ORDER BY s.name
//             `;
//         }

//         const pool = await getPool();
//         const result = await pool.query(query, params);
//         return result.rows;
//     } catch (error) {
//         console.error('Error in getStudentInfo:', error);
//         throw error;
//     }
// };

// const getStudentAttendanceSummary = async (studentId) => {
//     try {
//         const query = `
//             SELECT 
//                 COUNT(*) as total_days,
//                 COUNT(CASE WHEN status = 'present' THEN 1 END) as present_days,
//                 COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_days,
//                 ROUND(
//                     (COUNT(CASE WHEN status = 'present' THEN 1 END)::decimal / 
//                      NULLIF(COUNT(*), 0)) * 100, 2
//                 ) as attendance_percentage
//             FROM attendance 
//             WHERE student_id = $1
//         `;
//         const pool = await getPool();
//         const result = await pool.query(query, [studentId]);
//         return result.rows[0];
//     } catch (error) {
//         console.error('Error in getStudentAttendanceSummary:', error);
//         throw error;
//     }
// };

// const saveAttendance = async (attendanceData) => {
//     try {
//         const { date, class: className, records, teacherId } = attendanceData;

//         // Insert attendance records
//         const values = [];
//         const placeholders = [];

//         records.forEach((record, index) => {
//             values.push(record.studentId, date, record.status, className || null, teacherId || null);
//             placeholders.push(`($${values.length - 4}, $${values.length - 3}, $${values.length - 2}, $${values.length - 1}, $${values.length})`);
//         });

//         const query = `
//             INSERT INTO attendance (student_id, date, status, class, teacher_id)
//             VALUES ${placeholders.join(', ')}
//             ON CONFLICT (student_id, date)
//             DO UPDATE SET
//                 status = EXCLUDED.status,
//                 class = EXCLUDED.class,
//                 teacher_id = EXCLUDED.teacher_id,
//                 created_at = CURRENT_TIMESTAMP
//         `;

//         const pool = await getPool();
//         await pool.query(query, values);
//         return { success: true, message: 'Attendance saved successfully' };
//     } catch (error) {
//         console.error('Error saving attendance:', error);
//         throw error;
//     }
// };

// const getAttendanceByDateAndClass = async (date, className) => {
//     try {
//         const query = `
//             SELECT
//                 s.id as student_id,
//                 s.name,
//                 s.class,
//                 s.grade,
//                 a.date,
//                 a.status,
//                 a.class as attendance_class,
//                 a.teacher_id,
//                 t.name as teacher_name
//             FROM students s
//             LEFT JOIN attendance a ON s.id = a.student_id AND a.date = $1
//             LEFT JOIN teachers t ON a.teacher_id = t.id
//             WHERE s.class = $2
//             ORDER BY s.name
//         `;
//         const pool = await getPool();
//         const result = await pool.query(query, [date, className]);
//         return result.rows;
//     } catch (error) {
//         console.error('Error in getAttendanceByDateAndClass:', error);
//         throw error;
//     }
// };

// module.exports = {
//     getStudentInfo,
//     getStudentAttendanceSummary,
//     saveAttendance,
//     getAttendanceByDateAndClass
// };

const supabase = require('../config/supabaseDB');

const student = {
  getStudyMaterials: async () => {
    const { data, error } = await supabase
      .from('study_materials')
      .select('id, teacher_id, category, course, file_name, file_size, mime_type, uploaded_at')
      .order('uploaded_at', { ascending: false });

    if (error) throw error;

    // Generate public URLs from bucket
    return data.map(material => {
      const { data: publicUrlData } = supabase.storage
        .from('study-materials')
        .getPublicUrl(material.file_name);

      return {
        id: material.id,
        name: material.file_name,
        url: publicUrlData.publicUrl,
        category: material.category,
        course: material.course,
        size: material.file_size,
        mime_type: material.mime_type,
        uploaded_at: material.uploaded_at
      };
    });
  }
};

module.exports = student;