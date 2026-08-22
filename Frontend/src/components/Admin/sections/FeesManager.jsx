import React, { useEffect, useState } from 'react';
import { mockFetch } from '../../../mockData/mockFetch';
import ClassesGrid from './ClassesGrid';
import ClassFeeTable from './ClassFeeTable';

const FeesManager = () => {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);

  const fetchFees = async () => {
    try {
      const response = await mockFetch(`${URL}/api/fees`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setRecords(data.data || []);
    } catch (error) {
      console.error('Error fetching fee records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handlePaymentRecorded = (updatedRecord) => {
    setRecords((prev) => prev.map((r) => (r.student_id === updatedRecord.student_id ? updatedRecord : r)));
  };

  if (loading) {
    return <p className="text-sm text-on-surface-variant py-8 text-center mt-4 sm:mt-5">Loading fee records...</p>;
  }

  if (selectedClass) {
    return (
      <ClassFeeTable
        classLabel={selectedClass}
        records={records.filter((r) => r.class === selectedClass)}
        onBack={() => setSelectedClass(null)}
        onPaymentRecorded={handlePaymentRecorded}
      />
    );
  }

  return <ClassesGrid records={records} onSelectClass={setSelectedClass} />;
};

export default FeesManager;
