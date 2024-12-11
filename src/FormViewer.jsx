import React, { useRef, useState, useEffect } from "react";
import { useFormAutomation } from "./hooks/useFormAutomation";
import Airtable from 'airtable';
import { useSubmissions } from "./contexts/SubmissionContext";
import axios from 'axios';
import { seaTableService } from './services/seaTableService';

function FormViewer() {
  const webviewRef = useRef(null);
  const [isWebviewReady, setIsWebviewReady] = useState(false);
  const { submissions, currentSubmission, setCurrentSubmission } = useSubmissions();
  const { fillForm, debugDOM } = useFormAutomation(webviewRef, isWebviewReady, currentSubmission);
  const [showDetails, setShowDetails] = useState(true);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (webviewRef.current) {
      const webview = webviewRef.current;
      
      webview.addEventListener('did-finish-load', () => {
        console.log('Webview finished loading');
        setIsWebviewReady(true);
      });

      // Cleanup listener on unmount
      return () => {
        webview.removeEventListener('did-finish-load', () => {
          setIsWebviewReady(true);
        });
      };
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tables = await seaTableService.getMetadata();
        console.log('Tables:', tables);
        // Once we know the table name, we can fetch the actual data
        // const data = await seaTableService.getTableData();
        // setTableData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleFillForm = () => {
    setShowDetails(false);
    fillForm();
  };

  const styles = {
    container: {
      flex: 1,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    webview: {
      flex: 1,
      border: "none",
      margin: 0,
      padding: 0,
      width: "100%",
      height: "100%",
    },
    submissionDetails: {
      padding: "10px",
      backgroundColor: "#f5f5f5",
      marginBottom: "10px",
    },
    field: {
      margin: "4px 0",
    }
  };

  return (
    <div style={styles.container}>
      <select 
        onChange={(e) => setCurrentSubmission(submissions.find(s => s.id === e.target.value))}
        value={currentSubmission?.id || ''}
      >
        <option value="">Select a submission</option>
        {submissions.map(submission => (
          <option key={submission.id} value={submission.id}>
            {`${submission.vorname} ${submission.nachname}`}
          </option>
        ))}
      </select>
      
      {currentSubmission && showDetails && (
        <div style={styles.submissionDetails}>
          {Object.entries(currentSubmission).map(([key, value]) => (
            <div key={key} style={styles.field}>
              <strong>{key}: </strong>
              {value}
            </div>
          ))}
        </div>
      )}

      <button onClick={handleFillForm} disabled={!currentSubmission}>
        Fill Form
      </button>
      <webview
        ref={webviewRef}
        src="https://fms.bafa.de/BafaFrame/v2/ubf3"
        style={styles.webview}
        webpreferences="contextIsolation=true, nodeIntegration=false"
      />
    </div>
  );
}

export default FormViewer;
