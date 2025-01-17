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
        const data = await seaTableService.getRowsWithoutTimestamp();
        setSubmissions(data);
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

  const handleMarkAsDone = async () => {
    if (!currentSubmission) return;

    try {
      const currentDate = new Date().toISOString().split('T')[0];
      await seaTableService.updateRow(currentSubmission._id, {
        "beantragt am": currentDate,
      });

      // Fetch only unmarked rows
      const data = await seaTableService.getRowsWithoutTimestamp();
      setSubmissions(data);
      setCurrentSubmission(null);
      setShowMarkAsDone(false);

      alert("Successfully marked as done!");
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
              {`${submission.vorname || ''} ${submission.nachname || ''} ${submission.name_organisation ? `- ${submission.name_organisation}` : ''}`}
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
