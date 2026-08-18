export const mockTestResults = [
  {
    id: 1,
    testName: 'Algebra Fundamentals Quiz',
    subject: 'Mathematics',
    date: '2023-05-20',
    marks: 42,
    totalMarks: 50,
    percentage: 84
  },
  {
    id: 2,
    testName: 'Physics Midterm Exam',
    subject: 'Physics',
    date: '2023-05-15',
    marks: 78,
    totalMarks: 100,
    percentage: 78
  },
  {
    id: 3,
    testName: 'Chemistry Lab Test',
    subject: 'Chemistry',
    date: '2023-05-10',
    marks: 28,
    totalMarks: 30,
    percentage: 93
  },
  {
    id: 4,
    testName: 'Biology Quarterly Assessment',
    subject: 'Biology',
    date: '2023-05-05',
    marks: 85,
    totalMarks: 100,
    percentage: 85
  },
  {
    id: 5,
    testName: 'English Literature Quiz',
    subject: 'English',
    date: '2023-04-28',
    marks: 18,
    totalMarks: 20,
    percentage: 90
  }
];

export const getBarColor = (percentage) => {
  if (percentage >= 90) return 'bg-primary';
  if (percentage >= 80) return 'bg-secondary';
  if (percentage >= 70) return 'bg-tertiary-container';
  return 'bg-destructive';
};

export const getGradeColor = (percentage) => {
  if (percentage >= 90) return 'text-primary';
  if (percentage >= 80) return 'text-secondary';
  if (percentage >= 70) return 'text-tertiary-container';
  return 'text-destructive';
};

export const getGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  return 'D';
};
