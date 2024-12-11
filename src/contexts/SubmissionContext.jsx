import React, { createContext, useContext, useState, useEffect } from 'react';
import { seaTableService } from '../services/seaTableService';

const SubmissionContext = createContext();

export function SubmissionProvider({ children }) {
  const [submissions, setSubmissions] = useState([]);
  const [currentSubmission, setCurrentSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await seaTableService.getTableData();
        const submissionData = data.map(record => ({
          id: record._id,
          ...record
        }));
        setSubmissions(submissionData);
      } catch (err) {
        console.error('Error fetching submissions:', err);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <SubmissionContext.Provider value={{ 
      submissions,
      currentSubmission,
      setCurrentSubmission
    }}>
      {children}
    </SubmissionContext.Provider>
  );
}

export const useSubmissions = () => useContext(SubmissionContext); 