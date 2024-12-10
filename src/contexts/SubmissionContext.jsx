import React, { createContext, useContext, useState, useEffect } from 'react';
import Airtable from 'airtable';

const SubmissionContext = createContext();

export function SubmissionProvider({ children }) {
  const [submissions, setSubmissions] = useState([]);
  const [currentSubmission, setCurrentSubmission] = useState(null);

  useEffect(() => {
    const base = new Airtable({
      apiKey: 'patAsxSbVPqEclD2r.6ea222477fc8d1b96b24c19362dabd7da4461dd80425223ac7a401524549a38e'
    }).base('appoWynFcyhKrQjWb');

    base('tbl7fqxRhDepD6hRH').select({
      maxRecords: 100,
      view: 'Grid view'
    }).eachPage((records, fetchNextPage) => {
      const submissionData = records.map(record => ({
        id: record.id,
        ...record.fields
      }));
      setSubmissions(submissionData);
      fetchNextPage();
    }, (err) => {
      if (err) console.error(err);
    });
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