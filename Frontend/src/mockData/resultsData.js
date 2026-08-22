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
  { name: 'Shweta Supe', image: 'https://i.pravatar.cc/300?u=shweta-supe', percentage: 98.4, classKey: 'resultsClass10SscLabel', year: '2025–26', featured: true },
  { name: 'Sneha Kulkarni', image: 'https://i.pravatar.cc/300?u=sneha-kulkarni', percentage: 98.1, classKey: 'resultsClass12HscScienceLabel', year: '2025–26' },
  { name: 'Aarav Sharma', image: 'https://i.pravatar.cc/300?u=aarav-sharma', percentage: 97.9, classKey: 'resultsClass10SscLabel', year: '2025–26' },
  { name: 'Ananya Iyer', image: 'https://i.pravatar.cc/300?u=ananya-iyer', percentage: 97.6, classKey: 'resultsClass12HscScienceLabel', year: '2025–26' },
  { name: 'Yash Patil', image: 'https://i.pravatar.cc/300?u=yash-patil', percentage: 97.2, classKey: 'resultsClass10SscLabel', year: '2025–26' },
  { name: 'Diya Nair', image: 'https://i.pravatar.cc/300?u=diya-nair', percentage: 96.9, classKey: 'resultsClass12HscCommerceLabel', year: '2025–26' },
  { name: 'Kabir Malhotra', image: 'https://i.pravatar.cc/300?u=kabir-malhotra', percentage: 96.5, classKey: 'resultsClass10SscLabel', year: '2025–26' },
  { name: 'Riya Chavan', image: 'https://i.pravatar.cc/300?u=riya-chavan', percentage: 96.1, classKey: 'resultsClass12HscScienceLabel', year: '2025–26' },
];

export const ACHIEVERS_90_PLUS = [
  { name: 'Vivaan Mehta', image: 'https://i.pravatar.cc/300?u=vivaan-mehta', percentage: 95.8, classKey: 'foundationProgramClass10Label', batchKey: 'resultsBatchMorningA', school: "St. Xavier's High School" },
  { name: 'Ishaan Kapoor', image: 'https://i.pravatar.cc/300?u=ishaan-kapoor', percentage: 94.6, classKey: 'resultsClass12Label', batchKey: 'resultsBatchEveningB', school: 'Fergusson College' },
  { name: 'Rohan Gupta', image: 'https://i.pravatar.cc/300?u=rohan-gupta', percentage: 93.9, classKey: 'foundationProgramClass10Label', batchKey: 'resultsBatchMorningA', school: 'Delhi Public School' },
  { name: 'Aditya Verma', image: 'https://i.pravatar.cc/300?u=aditya-verma', percentage: 93.2, classKey: 'resultsClass12Label', batchKey: 'resultsBatchEveningB', school: 'Modern College' },
  { name: 'Myra Joshi', image: 'https://i.pravatar.cc/300?u=myra-joshi', percentage: 92.8, classKey: 'foundationProgramClass9Label', batchKey: 'resultsBatchWeekendC', school: 'Ryan International' },
  { name: 'Kiara Menon', image: 'https://i.pravatar.cc/300?u=kiara-menon', percentage: 92.4, classKey: 'foundationProgramClass10Label', batchKey: 'resultsBatchMorningA', school: "St. Xavier's High School" },
  { name: 'Aadhya Pillai', image: 'https://i.pravatar.cc/300?u=aadhya-pillai', percentage: 92.0, classKey: 'resultsClass12Label', batchKey: 'resultsBatchEveningB', school: 'Symbiosis College' },
  { name: 'Arjun Deshmukh', image: 'https://i.pravatar.cc/300?u=arjun-deshmukh', percentage: 91.7, classKey: 'resultsClass11Label', batchKey: 'resultsBatchMorningA', school: 'Fergusson College' },
  { name: 'Sai Kulkarni', image: 'https://i.pravatar.cc/300?u=sai-kulkarni', percentage: 91.3, classKey: 'foundationProgramClass9Label', batchKey: 'resultsBatchWeekendC', school: 'Delhi Public School' },
  { name: 'Om Joshi', image: 'https://i.pravatar.cc/300?u=om-joshi', percentage: 90.9, classKey: 'foundationProgramClass10Label', batchKey: 'resultsBatchMorningA', school: 'Ryan International' },
  { name: 'Reyansh Shinde', image: 'https://i.pravatar.cc/300?u=reyansh-shinde', percentage: 90.5, classKey: 'resultsClass11Label', batchKey: 'resultsBatchEveningB', school: 'Modern College' },
  { name: 'Tanvi Bhosale', image: 'https://i.pravatar.cc/300?u=tanvi-bhosale', percentage: 90.1, classKey: 'foundationProgramClass9Label', batchKey: 'resultsBatchWeekendC', school: "St. Xavier's High School" },
];

// stream here is a results-page-only label (SSC/HSC/Foundation tracks), not
// the STREAM_CLASSES used by attendance features in data.js — the two are
// independent mock datasets for different pages.
export const ACHIEVERS_80_PLUS = [
  { name: 'Neha Pawar', image: 'https://i.pravatar.cc/300?u=neha-pawar', percentage: 89.4, classKey: 'foundationProgramClass10Label', year: '2025–26', streamKey: 'resultsStreamSsc' },
  { name: 'Onkar Bhosale', image: 'https://i.pravatar.cc/300?u=onkar-bhosale', percentage: 88.7, classKey: 'resultsClass12Label', year: '2025–26', streamKey: 'resultsStreamHscScience' },
  { name: 'Siddhi Rane', image: 'https://i.pravatar.cc/300?u=siddhi-rane', percentage: 87.2, classKey: 'foundationProgramClass9Label', year: '2025–26', streamKey: 'resultsStreamJeeFoundation' },
  { name: 'Harsh Thakur', image: 'https://i.pravatar.cc/300?u=harsh-thakur', percentage: 85.9, classKey: 'resultsClass11Label', year: '2025–26', streamKey: 'resultsStreamNeetFoundation' },
  { name: 'Pranav Salunkhe', image: 'https://i.pravatar.cc/300?u=pranav-salunkhe', percentage: 84.3, classKey: 'foundationProgramClass10Label', year: '2025–26', streamKey: 'resultsStreamSsc' },
  { name: 'Ira Kadam', image: 'https://i.pravatar.cc/300?u=ira-kadam', percentage: 82.6, classKey: 'resultsClass12Label', year: '2025–26', streamKey: 'resultsStreamHscCommerce' },
  { name: 'Devika More', image: 'https://i.pravatar.cc/300?u=devika-more', percentage: 89.0, classKey: 'foundationProgramClass10Label', year: '2024–25', streamKey: 'resultsStreamSsc' },
  { name: 'Rutuja Gaikwad', image: 'https://i.pravatar.cc/300?u=rutuja-gaikwad', percentage: 86.5, classKey: 'resultsClass12Label', year: '2024–25', streamKey: 'resultsStreamHscScience' },
  { name: 'Aryan Naik', image: 'https://i.pravatar.cc/300?u=aryan-naik', percentage: 83.8, classKey: 'foundationProgramClass9Label', year: '2024–25', streamKey: 'resultsStreamJeeFoundation' },
  { name: 'Manasi Kale', image: 'https://i.pravatar.cc/300?u=manasi-kale', percentage: 81.2, classKey: 'resultsClass11Label', year: '2024–25', streamKey: 'resultsStreamNeetFoundation' },
  { name: 'Rohit Bansode', image: 'https://i.pravatar.cc/300?u=rohit-bansode', percentage: 88.1, classKey: 'foundationProgramClass10Label', year: '2023–24', streamKey: 'resultsStreamSsc' },
  { name: 'Sanika Phadke', image: 'https://i.pravatar.cc/300?u=sanika-phadke', percentage: 84.9, classKey: 'resultsClass12Label', year: '2023–24', streamKey: 'resultsStreamHscCommerce' },
  { name: 'Karan Chougule', image: 'https://i.pravatar.cc/300?u=karan-chougule', percentage: 82.0, classKey: 'foundationProgramClass9Label', year: '2023–24', streamKey: 'resultsStreamJeeFoundation' },
  { name: 'Vaishnavi Ghadge', image: 'https://i.pravatar.cc/300?u=vaishnavi-ghadge', percentage: 87.4, classKey: 'foundationProgramClass10Label', year: '2022–23', streamKey: 'resultsStreamSsc' },
  { name: 'Nikhil Sawant', image: 'https://i.pravatar.cc/300?u=nikhil-sawant', percentage: 83.5, classKey: 'resultsClass12Label', year: '2022–23', streamKey: 'resultsStreamHscScience' },
  { name: 'Pallavi Jagtap', image: 'https://i.pravatar.cc/300?u=pallavi-jagtap', percentage: 80.7, classKey: 'resultsClass11Label', year: '2022–23', streamKey: 'resultsStreamNeetFoundation' },
];

export const SUBJECT_TOPPERS = [
  { subjectKey: 'resultsSubjectMathematics', studentName: 'Shweta Supe', marks: 99, totalMarks: 100 },
  { subjectKey: 'resultsSubjectScience', studentName: 'Sneha Kulkarni', marks: 98, totalMarks: 100 },
  { subjectKey: 'resultsSubjectEnglish', studentName: 'Ananya Iyer', marks: 96, totalMarks: 100 },
  { subjectKey: 'resultsSubjectPhysics', studentName: 'Aarav Sharma', marks: 97, totalMarks: 100 },
  { subjectKey: 'resultsSubjectChemistry', studentName: 'Yash Patil', marks: 95, totalMarks: 100 },
  { subjectKey: 'resultsSubjectBiology', studentName: 'Diya Nair', marks: 98, totalMarks: 100 },
];

export const CLASSWISE_RESULTS = [
  { classKey: 'foundationProgramClass8Label', appeared: 88, passPercentage: 98, highestScore: 96.5, eightyPlusCount: 62 },
  { classKey: 'foundationProgramClass9Label', appeared: 104, passPercentage: 97, highestScore: 97.2, eightyPlusCount: 74 },
  { classKey: 'foundationProgramClass10Label', appeared: 156, passPercentage: 96, highestScore: 98.4, eightyPlusCount: 118 },
  { classKey: 'resultsClass11Label', appeared: 132, passPercentage: 95, highestScore: 96.8, eightyPlusCount: 92 },
  { classKey: 'resultsClass12Label', appeared: 140, passPercentage: 96, highestScore: 98.1, eightyPlusCount: 106 },
];

export const SUCCESS_STORIES = [
  {
    name: 'Aarav Sharma',
    challengeKey: 'successStory1ChallengeText',
    preparationKey: 'successStory1PreparationText',
    resultKey: 'successStory1ResultText',
  },
  {
    name: 'Diya Nair',
    challengeKey: 'successStory2ChallengeText',
    preparationKey: 'successStory2PreparationText',
    resultKey: 'successStory2ResultText',
  },
  {
    name: 'Om Joshi',
    challengeKey: 'successStory3ChallengeText',
    preparationKey: 'successStory3PreparationText',
    resultKey: 'successStory3ResultText',
  },
];

export const RESULT_TESTIMONIALS = [
  { quoteKey: 'testimonial1QuoteText', name: 'Shweta Supe', role: 'Class 10 SSC, 2025–26' },
  { quoteKey: 'testimonial2QuoteText', name: 'Rakesh Sharma', role: 'Parent of Aarav Sharma' },
  { quoteKey: 'testimonial3QuoteText', name: 'Sneha Kulkarni', role: 'Class 12 HSC Science, 2025–26' },
  { quoteKey: 'testimonial4QuoteText', name: 'Suresh Mehta', role: 'Parent of Vivaan Mehta' },
];
