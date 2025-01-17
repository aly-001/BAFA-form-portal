So this is the electron app that’s running this web view that lets me take data from sea table and automatically fill a form inside the app and so it has a functionality where I can click mark does it done and then it’s gonna add a timestamp to one of the fields in that row and so Then that row is not gonna appear in the initial drop-down so this kind of works except I would like you to change the implementation slightly where instead of filtering so that you don’t include that specific column if it’s filled, I’d like you to go to the actual sea table service And basically when you’re like initially getting all the contacts, just ignore the ones that have the timestamp so that we never see them and the way it’s gonna work cause it’s gonna reload and it’s gonna fetch everything and so make it really really robust that we don’t ever get contact with the date field filled.

Here's the seatable service and the main ui

import axios from 'axios';

const BASE_URL = 'https://cloud.seatable.io';
const AUTH_TOKEN = import.meta.env.VITE_SEATABLE_API_TOKEN;

const log = (message, data) => {
  if (process.env.NODE_ENV === 'development') {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
};

if (!AUTH_TOKEN) {
  throw new Error('VITE_SEATABLE_API_TOKEN is not defined in environment variables');
}

class SeaTableService {
  constructor() {
    this.accessToken = null;
    this.dtableServer = 'https://cloud.seatable.io/dtable-server/';
    this.dtableUuid = import.meta.env.VITE_SEATABLE_BASE_UUID;
  }

  async initialize() {
    try {
      const response = await axios({
        method: 'GET',
        url: `${BASE_URL}/api/v2.1/dtable/app-access-token/`,
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${AUTH_TOKEN}`
        }
      });

      this.accessToken = response.data.access_token;
      this.dtableServer = response.data.dtable_server;
    } catch (error) {
      console.error('Failed to initialize SeaTable service:', error);
      throw error;
    }
  }

  async getTableData() {
    if (!this.accessToken) {
      await this.initialize();
    }

    try {
      const response = await axios({
        method: 'GET',
        url: `${this.dtableServer}api/v1/dtables/${this.dtableUuid}/rows/`,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        },
        params: {
          convert_keys: true,
          table_name: 'Anträge BAFA ab 2023'
        }
      });
      
      return response.data.rows;
    } catch (error) {
      console.error('Failed to fetch table data:', error);
      throw error;
    }
  }

  async getMetadata() {
    if (!this.accessToken) {
      await this.initialize();
    }

    try {
      const response = await axios({
        method: 'GET',
        url: `${this.dtableServer}api/v1/dtables/${this.dtableUuid}/metadata/`,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        }
      });
      
      // log('Available tables:', response.data.metadata.tables);
      return response.data.metadata.tables;
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
      throw error;
    }
  }

  async updateRow(rowId, updateData) {
    if (!this.accessToken) {
      await this.initialize();
    }

    try {
      const response = await axios({
        method: 'PUT',
        url: `${this.dtableServer}api/v1/dtables/${this.dtableUuid}/rows/`,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        },
        data: {
          table_name: 'Anträge BAFA ab 2023',
          row_id: rowId,
          row: updateData
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update row:', error);
      throw error;
    }
  }
}

export const seaTableService = new SeaTableService();


import React, { useRef, useState, useEffect } from "react";
import { useFormAutomation } from "./hooks/useFormAutomation";
import Airtable from "airtable";
import { useSubmissions } from "./contexts/SubmissionContext";
import axios from "axios";
import { seaTableService } from "./services/seaTableService";
import { colors } from "./styles/colors";

const log = (message, data) => {
  if (process.env.NODE_ENV === "development") {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
};

function FormViewer() {
  const webviewRef = useRef(null);
  const [isWebviewReady, setIsWebviewReady] = useState(false);
  const { submissions, setSubmissions, currentSubmission, setCurrentSubmission } = useSubmissions();
  const [delayMultiplier, setDelayMultiplier] = useState(1);
  const [language, setLanguage] = useState("en");
  const [showDetails, setShowDetails] = useState(true);
  const [showMarkAsDone, setShowMarkAsDone] = useState(false);

  const styles = {
    container: {
      flex: 1,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      overflow: "auto",
      padding: "16px",
      backgroundColor: colors.secondaryBackground,
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    controlsRow: {
      display: "flex",
      gap: "16px",
      marginBottom: "16px",
      alignItems: "center",
    },
    select: {
      flex: 1,
      padding: "8px",
      borderRadius: "6px",
      border: `1px solid ${colors.tertiaryBackground}`,
      backgroundColor: colors.secondaryBackground,
      color: colors.primaryText,
    },
    delayControl: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      gap: "12px",
      color: colors.primaryText,
    },
    slider: {
      flex: 1,
      height: "36px",
      accentColor: colors.primary,
      borderRadius: "6px",
    },
    button: {
      padding: "8px 16px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: colors.fillFormButton,
      color: colors.secondaryBackground,
      cursor: "pointer",
      marginBottom: "16px",
      opacity: 1,
      "&:disabled": {
        backgroundColor: colors.tertiaryBackground,
        cursor: "not-allowed",
        opacity: 0.6,
      },
    },
    webview: {
      flex: 1,
      border: "none",
      margin: 0,
      padding: 0,
      width: "100%",
      height: "100%",
      borderRadius: "6px",
      overflow: "hidden",
    },
    submissionDetails: {
      padding: "10px",
      backgroundColor: colors.primaryBackground,
      marginBottom: "10px",
      borderRadius: "6px",
      color: colors.primaryText,
    },
    field: {
      margin: "4px 0",
    },
    markDoneButton: {
      padding: "8px 16px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: colors.success || '#28a745',
      color: colors.secondaryBackground,
      cursor: "pointer",
      marginBottom: "16px",
      marginLeft: "8px",
      opacity: 1,
    },
  };

  const translations = {
    en: {
      selectSubmission: "Select a submission",
      slowness: "Slowness",
      fillForm: "Fill Form",
      submitAndDownload: "Submit and Download PDF",
      markAsDone: "Mark as Done",
    },
    de: {
      selectSubmission: "Einreichung auswählen",
      slowness: "Geschwindigkeit",
      fillForm: "Formular ausfüllen",
      submitAndDownload: "Absenden und PDF herunterladen",
      markAsDone: "Als erledigt markieren",
    },
  };

  const { fillForm, debugDOM } = useFormAutomation(
    webviewRef,
    isWebviewReady,
    currentSubmission,
    delayMultiplier
  );

  useEffect(() => {
    if (webviewRef.current) {
      const webview = webviewRef.current;

      webview.addEventListener("did-finish-load", () => {
        log("Webview finished loading");
        setIsWebviewReady(true);
        webview.setZoomLevel(-1.8);
      });

      // Add new-window event listener
      webview.addEventListener('new-window', (event) => {
        log('New window requested:', event.url);
        // Prevent default behavior
        event.preventDefault();
        // You can handle the URL here if needed
      });

      // Cleanup listeners on unmount
      return () => {
        webview.removeEventListener("did-finish-load", () => {
          setIsWebviewReady(true);
        });
        webview.removeEventListener('new-window', () => {});
      };
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await seaTableService.getTableData();
        // Filter out rows that already have "beantragt am"
        const filteredData = data.filter(row => !row["beantragt am"]);
        setSubmissions(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFillForm = () => {
    setShowDetails(false);
    setShowMarkAsDone(true);
    fillForm(false);
  };

  const handleDangerousSubmit = () => {
    setShowDetails(false);
    if (
      window.confirm(
        "Are you sure you want to submit the form and download the PDF? This action cannot be undone."
      )
    ) {
      fillForm(true);
    }
  };

  const handleMarkAsDone = async () => {
    if (!currentSubmission) return;

    try {
      const currentDate = new Date().toISOString().split('T')[0];
      await seaTableService.updateRow(currentSubmission._id, {
        "beantragt am": currentDate,
      });

      // Refetch data
      const data = await seaTableService.getTableData();
      const filteredData = data.filter(row => !row["beantragt am"]);
      setSubmissions(filteredData);
      setCurrentSubmission(null);
      setShowMarkAsDone(false);

      // Show success message before reload
      alert("Successfully marked as done!");

      // Delay the reload to ensure SeaTable has time to persist the change
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error marking as done:", error);
      alert("Failed to mark as done. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.controlsRow}>
        <select
          style={styles.select}
          onChange={(e) => {
            const selected = submissions.find((s) => s._id === e.target.value);
            setCurrentSubmission(selected);
          }}
          value={currentSubmission?._id || ""}
        >
          <option key="default" value="">
            {translations[language].selectSubmission}
          </option>
          {submissions.map((submission) => (
            <option key={submission._id} value={submission._id}>
              {`${submission.vorname || ''} ${submission.nachname || ''}`}
            </option>
          ))}
        </select>

        <div style={styles.delayControl}>
          <span>{translations[language].slowness}:</span>
          <input
            type="range"
            style={styles.slider}
            min="0.5"
            max="3"
            step="0.1"
            value={delayMultiplier}
            onChange={(e) => setDelayMultiplier(Number(e.target.value))}
          />
          <span>{delayMultiplier}x</span>
        </div>

        <button
          onClick={() => setLanguage((lang) => (lang === "de" ? "en" : "de"))}
          style={{ ...styles.button, marginBottom: 0 }}
        >
          {language === "en" ? "DE" : "EN"}
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          style={{
            ...styles.button,
            width: 'fit-content',
          }}
          onClick={handleFillForm}
          disabled={!currentSubmission}
        >
          {translations[language].fillForm}
        </button>

        {showMarkAsDone && currentSubmission && (
          <button
            style={styles.markDoneButton}
            onClick={handleMarkAsDone}
          >
            {translations[language === 'de' ? 'de' : 'en'].markAsDone}
          </button>
        )}
      </div>

      <div
        style={{
          marginTop: "24px",
          marginBottom: "24px",
          padding: "16px",
          border: `2px dashed ${colors.danger || "#dc3545"}`,
          borderRadius: "8px",
        }}
      >
        <h3
          style={{
            color: colors.danger || "#dc3545",
            margin: "0 0 12px 0",
          }}
        >
          Test Zone
        </h3>
        <button
          style={{
            ...styles.button,
            backgroundColor: colors.danger || "#dc3545",
            opacity: currentSubmission ? 1 : 0.6,
            cursor: currentSubmission ? "pointer" : "not-allowed",
            marginBottom: 0,
          }}
          onClick={handleDangerousSubmit}
          disabled={!currentSubmission}
        >
          {translations[language].submitAndDownload}
        </button>
      </div>

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

      <webview
        ref={webviewRef}
        src="https://fms.bafa.de/BafaFrame/v2/ubf3"
        style={styles.webview}
        allowpopups="true"
        webpreferences="contextIsolation=true, nodeIntegration=false"
      />
    </div>
  );
}

export default FormViewer;
