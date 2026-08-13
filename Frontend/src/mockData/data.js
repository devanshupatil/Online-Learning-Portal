// Dummy data for demo purposes only. The real database is not connected;
// mockFetch.js serves this data in place of the live backend.

const isoDaysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const dateDaysAgo = (n) => isoDaysAgo(n).split('T')[0];

export const STREAM_CLASSES = ['JEE', 'NEET', 'CET (PCM)', 'CET (PCB)'];

// Students grouped by coaching stream — used by attendance features.
export const STUDENTS_BY_STREAM = [
  { student_id: 'STU101', id: 'STU101', name: 'Aarav Sharma', class: 'JEE' },
  { student_id: 'STU102', id: 'STU102', name: 'Vivaan Mehta', class: 'JEE' },
  { student_id: 'STU103', id: 'STU103', name: 'Ishaan Kapoor', class: 'JEE' },
  { student_id: 'STU104', id: 'STU104', name: 'Rohan Gupta', class: 'JEE' },
  { student_id: 'STU105', id: 'STU105', name: 'Aditya Verma', class: 'JEE' },
  { student_id: 'STU106', id: 'STU106', name: 'Kabir Malhotra', class: 'JEE' },
  { student_id: 'STU201', id: 'STU201', name: 'Ananya Iyer', class: 'NEET' },
  { student_id: 'STU202', id: 'STU202', name: 'Diya Nair', class: 'NEET' },
  { student_id: 'STU203', id: 'STU203', name: 'Saanvi Reddy', class: 'NEET' },
  { student_id: 'STU204', id: 'STU204', name: 'Myra Joshi', class: 'NEET' },
  { student_id: 'STU205', id: 'STU205', name: 'Kiara Menon', class: 'NEET' },
  { student_id: 'STU206', id: 'STU206', name: 'Aadhya Pillai', class: 'NEET' },
  { student_id: 'STU301', id: 'STU301', name: 'Arjun Deshmukh', class: 'CET (PCM)' },
  { student_id: 'STU302', id: 'STU302', name: 'Sai Kulkarni', class: 'CET (PCM)' },
  { student_id: 'STU303', id: 'STU303', name: 'Yash Patil', class: 'CET (PCM)' },
  { student_id: 'STU304', id: 'STU304', name: 'Om Joshi', class: 'CET (PCM)' },
  { student_id: 'STU305', id: 'STU305', name: 'Reyansh Shinde', class: 'CET (PCM)' },
  { student_id: 'STU401', id: 'STU401', name: 'Sneha Kulkarni', class: 'CET (PCB)' },
  { student_id: 'STU402', id: 'STU402', name: 'Pooja Jadhav', class: 'CET (PCB)' },
  { student_id: 'STU403', id: 'STU403', name: 'Riya Chavan', class: 'CET (PCB)' },
  { student_id: 'STU404', id: 'STU404', name: 'Neha Pawar', class: 'CET (PCB)' },
  { student_id: 'STU405', id: 'STU405', name: 'Tanvi Bhosale', class: 'CET (PCB)' },
];

// General student directory — used by the Student Directory page.
export const STUDENTS_DIRECTORY = [
  { student_id: 'DIR001', name: 'Aarav Sharma', class: 'Class A', grade: '12th', email: 'aarav.sharma@example.com', phone: '+91 98765 43210', parent_phone: '+91 98220 11223', parent_name: 'Rakesh Sharma', parent_email: 'rakesh.sharma@example.com', address: 'Andheri West, Mumbai', last_attendance_status: 'present' },
  { student_id: 'DIR002', name: 'Vivaan Mehta', class: 'Class A', grade: '12th', email: 'vivaan.mehta@example.com', phone: '+91 98220 44551', parent_phone: '+91 98220 44552', parent_name: 'Suresh Mehta', parent_email: 'suresh.mehta@example.com', address: 'Bandra East, Mumbai', last_attendance_status: 'present' },
  { student_id: 'DIR003', name: 'Ananya Iyer', class: 'Class B', grade: '11th', email: 'ananya.iyer@example.com', phone: '+91 90040 12233', parent_phone: '+91 90040 12234', parent_name: 'Ramesh Iyer', parent_email: 'ramesh.iyer@example.com', address: 'Powai, Mumbai', last_attendance_status: 'present' },
  { student_id: 'DIR004', name: 'Diya Nair', class: 'Class B', grade: '11th', email: 'diya.nair@example.com', phone: '+91 90040 55667', parent_phone: '+91 90040 55668', parent_name: 'Vinod Nair', parent_email: 'vinod.nair@example.com', address: 'Chembur, Mumbai', last_attendance_status: 'absent' },
  { student_id: 'DIR005', name: 'Arjun Deshmukh', class: 'Class C', grade: '10th', email: 'arjun.deshmukh@example.com', phone: '+91 88880 11122', parent_phone: '+91 88880 11123', parent_name: 'Prakash Deshmukh', parent_email: 'prakash.deshmukh@example.com', address: 'Kothrud, Pune', last_attendance_status: 'present' },
  { student_id: 'DIR006', name: 'Sai Kulkarni', class: 'Class C', grade: '10th', email: 'sai.kulkarni@example.com', phone: '+91 88880 33344', parent_phone: '+91 88880 33345', parent_name: 'Mahesh Kulkarni', parent_email: 'mahesh.kulkarni@example.com', address: 'Baner, Pune', last_attendance_status: 'late' },
  { student_id: 'DIR007', name: 'Sneha Kulkarni', class: 'Class D', grade: '9th', email: 'sneha.kulkarni@example.com', phone: '+91 77660 99887', parent_phone: '+91 77660 99888', parent_name: 'Ganesh Kulkarni', parent_email: 'ganesh.kulkarni@example.com', address: 'Viman Nagar, Pune', last_attendance_status: 'present' },
  { student_id: 'DIR008', name: 'Pooja Jadhav', class: 'Class D', grade: '9th', email: 'pooja.jadhav@example.com', phone: '+91 77660 22334', parent_phone: '+91 77660 22335', parent_name: 'Santosh Jadhav', parent_email: 'santosh.jadhav@example.com', address: 'Hadapsar, Pune', last_attendance_status: 'present' },
  { student_id: 'DIR009', name: 'Kabir Malhotra', class: 'Class A', grade: '12th', email: 'kabir.malhotra@example.com', phone: '+91 99887 66554', parent_phone: '+91 99887 66555', parent_name: 'Deepak Malhotra', parent_email: 'deepak.malhotra@example.com', address: 'Malad West, Mumbai', last_attendance_status: 'absent' },
  { student_id: 'DIR010', name: 'Kiara Menon', class: 'Class B', grade: '11th', email: 'kiara.menon@example.com', phone: '+91 99887 11223', parent_phone: '+91 99887 11224', parent_name: 'Anil Menon', parent_email: 'anil.menon@example.com', address: 'Thane West, Thane', last_attendance_status: 'present' },
  { student_id: 'DIR011', name: 'Yash Patil', class: 'Class C', grade: '10th', email: 'yash.patil@example.com', phone: '+91 99887 44556', parent_phone: '+91 99887 44557', parent_name: 'Vijay Patil', parent_email: 'vijay.patil@example.com', address: 'Aundh, Pune', last_attendance_status: 'present' },
  { student_id: 'DIR012', name: 'Riya Chavan', class: 'Class D', grade: '9th', email: 'riya.chavan@example.com', phone: '+91 99887 77889', parent_phone: '+91 99887 77890', parent_name: 'Sunil Chavan', parent_email: 'sunil.chavan@example.com', address: 'Wakad, Pune', last_attendance_status: 'present' },
];

// Study materials seed for the teacher's Material Manager.
export const STUDY_MATERIALS_SEED = [
  { name: 'Lectures/Mathematics/algebra-fundamentals.pdf', category: 'Lectures', course: 'Mathematics', uploaded_at: isoDaysAgo(2), size: 2500000, url: '#' },
  { name: 'Assignments/Physics/mechanics-problem-set.pdf', category: 'Assignments', course: 'Physics', uploaded_at: isoDaysAgo(4), size: 1300000, url: '#' },
  { name: 'Resources/Chemistry/periodic-table-guide.pdf', category: 'Resources', course: 'Chemistry', uploaded_at: isoDaysAgo(6), size: 900000, url: '#' },
  { name: 'Lectures/Science/cell-structure-notes.pptx', category: 'Lectures', course: 'Science', uploaded_at: isoDaysAgo(9), size: 4200000, url: '#' },
  { name: 'Exams/Mathematics/mock-test-solutions.pdf', category: 'Exams', course: 'Mathematics', uploaded_at: isoDaysAgo(12), size: 1800000, url: '#' },
  { name: 'Projects/Computer Science/python-basics-slides.pptx', category: 'Projects', course: 'Computer Science', uploaded_at: isoDaysAgo(15), size: 3100000, url: '#' },
];

// Test materials seed for the teacher's Test Manager.
export const TEST_MATERIALS_SEED = [
  { id: 1, name: 'Exams/Physics/jee-mock-test-1.pdf', course: 'Physics', uploaded_at: isoDaysAgo(3), size: 2100000, url: '#', mime_type: 'application/pdf' },
  { id: 2, name: 'Exams/Mathematics/neet-mock-test-2.jpg', course: 'Mathematics', uploaded_at: isoDaysAgo(5), size: 950000, url: '#', mime_type: 'image/jpeg' },
  { id: 3, name: 'Exams/Chemistry/cet-practice-paper.pdf', course: 'Chemistry', uploaded_at: isoDaysAgo(8), size: 1750000, url: '#', mime_type: 'application/pdf' },
  { id: 4, name: 'Exams/Biology/neet-biology-test.jpg', course: 'Biology', uploaded_at: isoDaysAgo(11), size: 880000, url: '#', mime_type: 'image/jpeg' },
  { id: 5, name: 'Exams/Computer/cs-fundamentals-quiz.pdf', course: 'Computer', uploaded_at: isoDaysAgo(14), size: 1200000, url: '#', mime_type: 'application/pdf' },
];

// Materials shown on the learner's dashboard.
export const LEARNER_MATERIALS = [
  { name: 'algebra-fundamentals.pdf', size: 2500000, uploaded_at: isoDaysAgo(2), url: '#' },
  { name: 'mechanics-problem-set.pdf', size: 1300000, uploaded_at: isoDaysAgo(4), url: '#' },
  { name: 'periodic-table-guide.pdf', size: 900000, uploaded_at: isoDaysAgo(6), url: '#' },
  { name: 'cell-structure-notes.pptx', size: 4200000, uploaded_at: isoDaysAgo(9), url: '#' },
  { name: 'python-basics-slides.pptx', size: 3100000, uploaded_at: isoDaysAgo(15), url: '#' },
];

// Tests shown on the learner's dashboard.
export const LEARNER_TESTS = [
  { id: 1, test_name: 'JEE Mock Test - Physics Mechanics', course: 'Physics', updated_at: isoDaysAgo(1) },
  { id: 2, test_name: 'NEET Practice Test - Human Physiology', course: 'Biology', updated_at: isoDaysAgo(3) },
  { id: 3, test_name: 'CET Mock Test - Organic Chemistry', course: 'Chemistry', updated_at: isoDaysAgo(5) },
  { id: 4, test_name: 'JEE Mock Test - Algebra & Calculus', course: 'Mathematics', updated_at: isoDaysAgo(7) },
];

// Sample AI-analysis result returned when a teacher "converts" a scanned test image.
export const IMAGE_ANALYSIS_SAMPLE = {
  analysis: {
    questions: [
      {
        id: 1,
        question: 'A particle moves in a straight line with constant acceleration. If it covers 20 m in the first 2 s and 40 m in the next 2 s, what is its acceleration?',
        options: ['2.5 m/s²', '5 m/s²', '7.5 m/s²', '10 m/s²'],
        answer: '5 m/s²',
      },
      {
        id: 2,
        question: 'Which of the following is the correct IUPAC name for CH3-CH2-OH?',
        options: ['Methanol', 'Ethanol', 'Propanol', 'Ethanal'],
        answer: 'Ethanol',
      },
      {
        id: 3,
        question: 'The derivative of sin(x) with respect to x is:',
        options: ['cos(x)', '-cos(x)', '-sin(x)', 'tan(x)'],
        answer: 'cos(x)',
      },
    ],
  },
};

// Seed ~8 weeks of attendance history so reports/trends have data on first load.
export const seedAttendanceHistory = () => {
  const records = [];
  const teacher = { id: 1, name: 'John Smith' };

  for (let dayOffset = 0; dayOffset < 56; dayOffset++) {
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toISOString().split('T')[0];

    STUDENTS_BY_STREAM.forEach((student) => {
      const present = Math.random() < 0.88;
      records.push({
        student_id: student.student_id,
        name: student.name,
        class: student.class,
        status: present ? 'present' : 'absent',
        date: dateStr,
        teacher_id: teacher.id,
        teacher_name: teacher.name,
      });
    });
  }

  return records;
};

// --- Parent portal demo data ---
// The demo shows a single child (Aarav Sharma) so the Parents dashboard
// stays consistent with the same student referenced in the Teacher/Learner
// mock data (STUDENTS_BY_STREAM / STUDENTS_DIRECTORY).
export const PARENT_CHILD = {
  id: 'STU101',
  rollNo: 'DIR001',
  name: 'Aarav Sharma',
  stream: 'JEE',
  grade: '12th',
  institute: 'EduLearn Coaching Center',
  parentName: 'Rakesh Sharma',
  parentEmail: 'rakesh.sharma@example.com',
};

export const CHILD_SCHEDULE = [
  { day: 'Monday', subject: 'Mathematics', time: '6:00 AM - 7:30 AM', teacher: 'John Smith', room: 'Room 101' },
  { day: 'Monday', subject: 'Physics', time: '7:30 AM - 9:00 AM', teacher: 'Priya Rao', room: 'Room 203' },
  { day: 'Tuesday', subject: 'Chemistry', time: '6:00 AM - 7:30 AM', teacher: 'Anil Kulkarni', room: 'Room 105' },
  { day: 'Tuesday', subject: 'Mathematics', time: '7:30 AM - 9:00 AM', teacher: 'John Smith', room: 'Room 101' },
  { day: 'Wednesday', subject: 'Physics', time: '6:00 AM - 7:30 AM', teacher: 'Priya Rao', room: 'Room 203' },
  { day: 'Wednesday', subject: 'Chemistry', time: '7:30 AM - 9:00 AM', teacher: 'Anil Kulkarni', room: 'Room 105' },
  { day: 'Thursday', subject: 'Mathematics', time: '6:00 AM - 7:30 AM', teacher: 'John Smith', room: 'Room 101' },
  { day: 'Thursday', subject: 'Physics', time: '7:30 AM - 9:00 AM', teacher: 'Priya Rao', room: 'Room 203' },
  { day: 'Friday', subject: 'Chemistry', time: '6:00 AM - 7:30 AM', teacher: 'Anil Kulkarni', room: 'Room 105' },
  { day: 'Friday', subject: 'Mathematics', time: '7:30 AM - 9:00 AM', teacher: 'John Smith', room: 'Room 101' },
  { day: 'Saturday', subject: 'Full Syllabus Mock Test', time: '9:00 AM - 12:00 PM', teacher: 'John Smith', room: 'Exam Hall' },
];

export const CHILD_ATTENDANCE_BY_SUBJECT = [
  { subject: 'Mathematics', totalClasses: 48, attended: 44 },
  { subject: 'Physics', totalClasses: 46, attended: 41 },
  { subject: 'Chemistry', totalClasses: 44, attended: 40 },
];

export const CHILD_RECENT_ATTENDANCE = [
  { date: dateDaysAgo(0), status: 'present' },
  { date: dateDaysAgo(1), status: 'present' },
  { date: dateDaysAgo(2), status: 'absent' },
  { date: dateDaysAgo(3), status: 'present' },
  { date: dateDaysAgo(4), status: 'present' },
  { date: dateDaysAgo(5), status: 'present' },
  { date: dateDaysAgo(6), status: 'present' },
  { date: dateDaysAgo(7), status: 'absent' },
  { date: dateDaysAgo(8), status: 'present' },
  { date: dateDaysAgo(9), status: 'present' },
];

export const CHILD_TEST_MARKS = [
  { test_name: 'JEE Mock Test - Physics Mechanics', subject: 'Physics', date: dateDaysAgo(1), marksObtained: 78, totalMarks: 100 },
  { test_name: 'JEE Mock Test - Algebra & Calculus', subject: 'Mathematics', date: dateDaysAgo(7), marksObtained: 85, totalMarks: 100 },
  { test_name: 'CET Mock Test - Organic Chemistry', subject: 'Chemistry', date: dateDaysAgo(5), marksObtained: 71, totalMarks: 100 },
  { test_name: 'JEE Mock Test - Physics Mechanics', subject: 'Physics', date: dateDaysAgo(15), marksObtained: 74, totalMarks: 100 },
  { test_name: 'JEE Mock Test - Algebra & Calculus', subject: 'Mathematics', date: dateDaysAgo(20), marksObtained: 80, totalMarks: 100 },
];
