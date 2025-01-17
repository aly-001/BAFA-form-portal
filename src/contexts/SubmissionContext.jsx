import React, { createContext, useContext, useState, useEffect } from 'react';
import { seaTableService } from '../services/seaTableService';

const SubmissionContext = createContext();

export function SubmissionProvider({ children }) {
  const [submissions, setSubmissions] = useState([]);
  const [currentSubmission, setCurrentSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await seaTableService.getRowsWithoutTimestamp();
        setSubmissions(data);
      } catch (err) {
        console.error('Error fetching submissions:', err);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <SubmissionContext.Provider value={{ 
      submissions,
      setSubmissions,
      currentSubmission,
      setCurrentSubmission
    }}>
      {children}
    </SubmissionContext.Provider>
  );
}

export const useSubmissions = () => useContext(SubmissionContext); 