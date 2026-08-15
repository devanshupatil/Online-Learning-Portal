// Dummy data for demo purposes only. The real database is not connected;
// this file stands in for a backend results/marks system on the Results page.

export const RESULTS_OVERALL_STATS = {
  passRate: 96,
  students80Plus: 540,
  students90Plus: 128,
  toppers: 24,
  yearsConsistent: 13,
};

// Newest year first — drives both the Year-wise Results tabs (default
// selection = index 0) and the Growth Chart (which reverses this order).
export const RESULTS_BY_YEAR = [
  { year: '2025–26', totalStudents: 620, passPercentage: 96, eightyPlusCount: 540, ninetyPlusCount: 128, highestPercentage: 98.4 },
  { year: '2024–25', totalStudents: 590, passPercentage: 95, eightyPlusCount: 505, ninetyPlusCount: 118, highestPercentage: 98.0 },
  { year: '2023–24', totalStudents: 560, passPercentage: 94, eightyPlusCount: 470, ninetyPlusCount: 105, highestPercentage: 97.6 },
  { year: '2022–23', totalStudents: 530, passPercentage: 92, eightyPlusCount: 430, ninetyPlusCount: 92, highestPercentage: 96.8 },
];

export const TOP_ACHIEVERS = [
  { name: 'Rahul Patil', percentage: 98.4, class: 'Class 10 · SSC', year: '2025–26', featured: true },
  { name: 'Sneha Kulkarni', percentage: 98.1, class: 'Class 12 · HSC Science', year: '2025–26' },
  { name: 'Aarav Sharma', percentage: 97.9, class: 'Class 10 · SSC', year: '2025–26' },
  { name: 'Ananya Iyer', percentage: 97.6, class: 'Class 12 · HSC Science', year: '2025–26' },
  { name: 'Yash Patil', percentage: 97.2, class: 'Class 10 · SSC', year: '2025–26' },
  { name: 'Diya Nair', percentage: 96.9, class: 'Class 12 · HSC Commerce', year: '2025–26' },
  { name: 'Kabir Malhotra', percentage: 96.5, class: 'Class 10 · SSC', year: '2025–26' },
  { name: 'Riya Chavan', percentage: 96.1, class: 'Class 12 · HSC Science', year: '2025–26' },
];

export const ACHIEVERS_90_PLUS = [
  { name: 'Vivaan Mehta', percentage: 95.8, class: 'Class 10', batch: 'Morning Batch A', school: "St. Xavier's High School" },
  { name: 'Ishaan Kapoor', percentage: 94.6, class: 'Class 12', batch: 'Evening Batch B', school: 'Fergusson College' },
  { name: 'Rohan Gupta', percentage: 93.9, class: 'Class 10', batch: 'Morning Batch A', school: 'Delhi Public School' },
  { name: 'Aditya Verma', percentage: 93.2, class: 'Class 12', batch: 'Evening Batch B', school: 'Modern College' },
  { name: 'Myra Joshi', percentage: 92.8, class: 'Class 9', batch: 'Weekend Batch C', school: 'Ryan International' },
  { name: 'Kiara Menon', percentage: 92.4, class: 'Class 10', batch: 'Morning Batch A', school: "St. Xavier's High School" },
  { name: 'Aadhya Pillai', percentage: 92.0, class: 'Class 12', batch: 'Evening Batch B', school: 'Symbiosis College' },
  { name: 'Arjun Deshmukh', percentage: 91.7, class: 'Class 11', batch: 'Morning Batch A', school: 'Fergusson College' },
  { name: 'Sai Kulkarni', percentage: 91.3, class: 'Class 9', batch: 'Weekend Batch C', school: 'Delhi Public School' },
  { name: 'Om Joshi', percentage: 90.9, class: 'Class 10', batch: 'Morning Batch A', school: 'Ryan International' },
  { name: 'Reyansh Shinde', percentage: 90.5, class: 'Class 11', batch: 'Evening Batch B', school: 'Modern College' },
  { name: 'Tanvi Bhosale', percentage: 90.1, class: 'Class 9', batch: 'Weekend Batch C', school: "St. Xavier's High School" },
];

// stream here is a results-page-only label (SSC/HSC/Foundation tracks), not
// the STREAM_CLASSES used by attendance features in data.js — the two are
// independent mock datasets for different pages.
export const ACHIEVERS_80_PLUS = [
  { name: 'Neha Pawar', percentage: 89.4, class: 'Class 10', year: '2025–26', stream: 'SSC' },
  { name: 'Onkar Bhosale', percentage: 88.7, class: 'Class 12', year: '2025–26', stream: 'HSC Science' },
  { name: 'Siddhi Rane', percentage: 87.2, class: 'Class 9', year: '2025–26', stream: 'JEE Foundation' },
  { name: 'Harsh Thakur', percentage: 85.9, class: 'Class 11', year: '2025–26', stream: 'NEET Foundation' },
  { name: 'Pranav Salunkhe', percentage: 84.3, class: 'Class 10', year: '2025–26', stream: 'SSC' },
  { name: 'Ira Kadam', percentage: 82.6, class: 'Class 12', year: '2025–26', stream: 'HSC Commerce' },
  { name: 'Devika More', percentage: 89.0, class: 'Class 10', year: '2024–25', stream: 'SSC' },
  { name: 'Rutuja Gaikwad', percentage: 86.5, class: 'Class 12', year: '2024–25', stream: 'HSC Science' },
  { name: 'Aryan Naik', percentage: 83.8, class: 'Class 9', year: '2024–25', stream: 'JEE Foundation' },
  { name: 'Manasi Kale', percentage: 81.2, class: 'Class 11', year: '2024–25', stream: 'NEET Foundation' },
  { name: 'Rohit Bansode', percentage: 88.1, class: 'Class 10', year: '2023–24', stream: 'SSC' },
  { name: 'Sanika Phadke', percentage: 84.9, class: 'Class 12', year: '2023–24', stream: 'HSC Commerce' },
  { name: 'Karan Chougule', percentage: 82.0, class: 'Class 9', year: '2023–24', stream: 'JEE Foundation' },
  { name: 'Vaishnavi Ghadge', percentage: 87.4, class: 'Class 10', year: '2022–23', stream: 'SSC' },
  { name: 'Nikhil Sawant', percentage: 83.5, class: 'Class 12', year: '2022–23', stream: 'HSC Science' },
  { name: 'Pallavi Jagtap', percentage: 80.7, class: 'Class 11', year: '2022–23', stream: 'NEET Foundation' },
];

export const SUBJECT_TOPPERS = [
  { subject: 'Mathematics', studentName: 'Rahul Patil', marks: 99, totalMarks: 100 },
  { subject: 'Science', studentName: 'Sneha Kulkarni', marks: 98, totalMarks: 100 },
  { subject: 'English', studentName: 'Ananya Iyer', marks: 96, totalMarks: 100 },
  { subject: 'Physics', studentName: 'Aarav Sharma', marks: 97, totalMarks: 100 },
  { subject: 'Chemistry', studentName: 'Yash Patil', marks: 95, totalMarks: 100 },
  { subject: 'Biology', studentName: 'Diya Nair', marks: 98, totalMarks: 100 },
];

export const CLASSWISE_RESULTS = [
  { class: 'Class 8', appeared: 88, passPercentage: 98, highestScore: 96.5, eightyPlusCount: 62 },
  { class: 'Class 9', appeared: 104, passPercentage: 97, highestScore: 97.2, eightyPlusCount: 74 },
  { class: 'Class 10', appeared: 156, passPercentage: 96, highestScore: 98.4, eightyPlusCount: 118 },
  { class: 'Class 11', appeared: 132, passPercentage: 95, highestScore: 96.8, eightyPlusCount: 92 },
  { class: 'Class 12', appeared: 140, passPercentage: 96, highestScore: 98.1, eightyPlusCount: 106 },
];

export const SUCCESS_STORIES = [
  {
    name: 'Aarav Sharma',
    challenge: 'Struggled with time management in Physics numericals and consistently ran out of time in mock tests.',
    preparation: 'Joined the Morning Batch A intensive track, followed a structured daily practice schedule, and worked one-on-one with faculty on speed-solving techniques.',
    result: 'Improved his Physics score from 68% to 94% and secured 97.9% overall in the SSC 2025–26 boards.',
  },
  {
    name: 'Diya Nair',
    challenge: 'Found Organic Chemistry conceptually difficult and lacked confidence answering long-form questions.',
    preparation: 'Attended weekly doubt-clearing sessions, built a personal formula and reaction notebook, and took part-syllabus tests every two weeks.',
    result: 'Became a Biology subject topper with 98/100 and scored 96.9% in the HSC Commerce 2025–26 exams.',
  },
  {
    name: 'Om Joshi',
    challenge: 'Inconsistent attendance in the early months due to travel, leading to gaps in foundational concepts.',
    preparation: 'Used recorded lecture material to catch up, attended weekend remedial classes, and stayed in close contact with mentors on tracked progress.',
    result: 'Closed every conceptual gap and finished with 90.9%, crossing the 90%+ mark for the first time.',
  },
];

export const RESULT_TESTIMONIALS = [
  { quote: "The teachers didn't just teach the syllabus, they taught us how to think under exam pressure.", name: 'Rahul Patil', role: 'Class 10 SSC, 2025–26' },
  { quote: 'As a parent, the regular progress updates gave me real confidence that my daughter was on track.', name: 'Rakesh Sharma', role: 'Parent of Aarav Sharma' },
  { quote: 'The personalized doubt-clearing sessions made all the difference for my weakest subject.', name: 'Sneha Kulkarni', role: 'Class 12 HSC Science, 2025–26' },
  { quote: 'From a 68% in Physics to full confidence in the exam hall — this place changed how my son studies.', name: 'Suresh Mehta', role: 'Parent of Vivaan Mehta' },
];
