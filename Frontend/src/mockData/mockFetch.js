// Drop-in replacement for fetch() that serves dummy data instead of hitting
// the (currently disconnected) backend. Used only for the client demo build —
// remove the mockFetch import/usages to restore real API calls once the DB
// is reconnected.

import {
  STUDENTS_BY_STREAM,
  STUDENTS_DIRECTORY,
  STUDY_MATERIALS_SEED,
  TEST_MATERIALS_SEED,
  LEARNER_MATERIALS,
  LEARNER_TESTS,
  IMAGE_ANALYSIS_SAMPLE,
  seedAttendanceHistory,
} from './data';
import { seedFeeRecords, deriveInstallmentStatus } from './feesData';

// In-memory stores so actions taken during the demo (marking attendance,
// deleting a material, etc.) are reflected immediately in the UI.
let attendanceStore = seedAttendanceHistory();
let studyMaterials = [...STUDY_MATERIALS_SEED];
let testMaterials = [...TEST_MATERIALS_SEED];
let nextTestMaterialId = testMaterials.length + 1;
let feeRecords = seedFeeRecords();

const NETWORK_DELAY_MS = 300;

const jsonResponse = (status, data) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data,
  text: async () => JSON.stringify(data),
  blob: async () => new Blob([JSON.stringify(data)], { type: 'application/json' }),
});

const blobResponse = () => ({
  ok: true,
  status: 200,
  blob: async () => new Blob(['This is a mock file generated for the demo.'], { type: 'text/plain' }),
  json: async () => ({}),
  text: async () => '',
});

const getPathAndQuery = (url) => {
  const parsed = new URL(url, 'http://mock-backend.local');
  return { path: parsed.pathname, query: parsed.searchParams };
};

const routes = [
  {
    method: 'GET',
    pattern: /^\/api\/getAllStudentcount$/,
    handler: () => jsonResponse(200, { students: STUDENTS_BY_STREAM.length }),
  },
  {
    method: 'GET',
    pattern: /^\/api\/getAllStudentInfo$/,
    handler: () => jsonResponse(200, { data: STUDENTS_BY_STREAM }),
  },
  {
    method: 'GET',
    pattern: /^\/api\/students$/,
    handler: () => jsonResponse(200, { data: STUDENTS_DIRECTORY }),
  },
  {
    method: 'POST',
    pattern: /^\/api\/attendance$/,
    handler: (_match, _query, body) => {
      const { date, class: className, teacherId, records = [] } = JSON.parse(body || '{}');
      attendanceStore = attendanceStore.filter(
        (r) => !(r.date === date && r.class === className)
      );
      records.forEach((record) => {
        attendanceStore.push({
          student_id: record.studentId,
          name: record.name,
          class: className,
          status: record.status,
          date,
          teacher_id: teacherId,
          teacher_name: 'John Smith',
        });
      });
      return jsonResponse(200, { message: 'Attendance saved successfully' });
    },
  },
  {
    method: 'GET',
    pattern: /^\/api\/attendance$/,
    handler: (_match, query) => {
      const date = query.get('date');
      const className = query.get('class');
      const data = attendanceStore.filter((r) => r.date === date && r.class === className);
      return jsonResponse(200, { data });
    },
  },
  {
    method: 'GET',
    pattern: /^\/api\/attendanceRecords\/([^/]+)$/,
    handler: (_match, query) => {
      const className = query.get('class');
      const startDate = query.get('startDate');
      const endDate = query.get('endDate');
      const data = attendanceStore.filter(
        (r) => r.class === className && r.date >= startDate && r.date <= endDate
      );
      return jsonResponse(200, { data });
    },
  },
  {
    method: 'GET',
    pattern: /^\/api\/getStudyMaterials\/([^/]+)$/,
    handler: () => jsonResponse(200, { materials: studyMaterials }),
  },
  {
    method: 'DELETE',
    pattern: /^\/api\/deleteStudyMaterial$/,
    handler: (_match, _query, body) => {
      const { fileName } = JSON.parse(body || '{}');
      studyMaterials = studyMaterials.filter((m) => m.name !== fileName);
      return jsonResponse(200, { message: 'Deleted successfully' });
    },
  },
  {
    method: 'POST',
    pattern: /^\/api\/UploadStudyMaterial\/([^/]+)$/,
    handler: (_match, _query, body) => {
      const category = body?.get ? body.get('category') : 'Resources';
      const course = body?.get ? body.get('course') : 'General';
      const files = body?.getAll ? body.getAll('files') : [];
      files.forEach((file, index) => {
        studyMaterials = [
          {
            name: `${category}/${course}/${file.name || `upload-${index}.pdf`}`,
            category,
            course,
            uploaded_at: new Date().toISOString(),
            size: file.size || 1000000,
            url: '#',
          },
          ...studyMaterials,
        ];
      });
      return jsonResponse(200, { message: 'Uploaded successfully' });
    },
  },
  {
    method: 'POST',
    pattern: /^\/api\/UploadTestsMaterial\/([^/]+)$/,
    handler: (_match, _query, body) => {
      const course = body?.get ? body.get('course') : 'General';
      const files = body?.getAll ? body.getAll('files') : [];
      files.forEach((file) => {
        testMaterials = [
          {
            id: nextTestMaterialId++,
            name: `Exams/${course}/${file.name || 'upload.pdf'}`,
            course,
            uploaded_at: new Date().toISOString(),
            size: file.size || 1000000,
            url: '#',
            mime_type: file.type || 'application/pdf',
          },
          ...testMaterials,
        ];
      });
      return jsonResponse(200, { message: 'Uploaded successfully' });
    },
  },
  {
    method: 'GET',
    pattern: /^\/api\/getTestsMaterials\/([^/]+)$/,
    handler: () => jsonResponse(200, { materials: testMaterials }),
  },
  {
    method: 'DELETE',
    pattern: /^\/api\/deleteTestsMaterials$/,
    handler: (_match, _query, body) => {
      const { fileName } = JSON.parse(body || '{}');
      testMaterials = testMaterials.filter((m) => m.name !== fileName);
      return jsonResponse(200, { message: 'Deleted successfully' });
    },
  },
  {
    method: 'PUT',
    pattern: /^\/api\/updateTestMaterial\/([^/]+)$/,
    handler: () => jsonResponse(200, { message: 'Updated successfully' }),
  },
  {
    method: 'GET',
    pattern: /^\/api\/downloadTestMaterial\/([^/]+)$/,
    handler: () => blobResponse(),
  },
  {
    method: 'GET',
    pattern: /^\/api\/getImageAnalysis\/([^/]+)$/,
    handler: () => jsonResponse(404, { message: 'No existing analysis found' }),
  },
  {
    method: 'POST',
    pattern: /^\/api\/analyzeImage$/,
    handler: () => jsonResponse(200, IMAGE_ANALYSIS_SAMPLE),
  },
  {
    method: 'POST',
    pattern: /^\/api\/saveImageAnalysis$/,
    handler: () => jsonResponse(200, { message: 'Analysis saved successfully' }),
  },
  {
    method: 'GET',
    pattern: /^\/api\/studyMaterials\/([^/]+)$/,
    handler: () => jsonResponse(200, { studyMaterials: LEARNER_MATERIALS }),
  },
  {
    method: 'GET',
    pattern: /^\/api\/textAnalysis$/,
    handler: () => jsonResponse(200, { textAnalyses: LEARNER_TESTS }),
  },
  {
    method: 'GET',
    pattern: /^\/admin\/settings\/llm_model$/,
    handler: () => jsonResponse(200, { value: 'openAI' }),
  },
  {
    method: 'POST',
    pattern: /^\/admin\/settings$/,
    handler: () => jsonResponse(200, { message: 'Settings saved' }),
  },
  {
    method: 'GET',
    pattern: /^\/api\/fees$/,
    handler: () => jsonResponse(200, { data: feeRecords }),
  },
  {
    method: 'GET',
    pattern: /^\/api\/fees\/([^/]+)$/,
    handler: (match) => {
      const record = feeRecords.find((r) => r.student_id === match[1]);
      if (!record) return jsonResponse(404, { message: 'Fee record not found' });
      return jsonResponse(200, { data: record });
    },
  },
  {
    method: 'POST',
    pattern: /^\/api\/fees\/([^/]+)\/pay$/,
    handler: (match, _query, body) => {
      const record = feeRecords.find((r) => r.student_id === match[1]);
      if (!record) return jsonResponse(404, { message: 'Fee record not found' });

      const { installmentId, amount, method, date } = JSON.parse(body || '{}');
      const installment = record.installments.find((i) => i.id === installmentId);
      if (!installment) return jsonResponse(404, { message: 'Installment not found' });

      installment.paidAmount += Number(amount) || 0;
      installment.paidDate = date;
      installment.method = method;
      if (!installment.receiptNo) {
        installment.receiptNo = `RCPT-${installment.id}`;
      }
      installment.status = deriveInstallmentStatus(installment);

      return jsonResponse(200, { data: record });
    },
  },
];

export const mockFetch = (url, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const { path, query } = getPathAndQuery(url);

  const route = routes.find((r) => r.method === method && r.pattern.test(path));

  return new Promise((resolve) => {
    setTimeout(() => {
      if (!route) {
        console.warn(`[mockFetch] No mock route for ${method} ${path}`);
        resolve(jsonResponse(404, { message: 'Not found (demo mode)' }));
        return;
      }
      const match = path.match(route.pattern);
      resolve(route.handler(match, query, options.body));
    }, NETWORK_DELAY_MS);
  });
};
