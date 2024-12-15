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
  const { submissions, currentSubmission, setCurrentSubmission } =
    useSubmissions();
  const [delayMultiplier, setDelayMultiplier] = useState(1);
  const [language, setLanguage] = useState("en");

  const { fillForm, debugDOM } = useFormAutomation(
    webviewRef,
    isWebviewReady,
    currentSubmission,
    delayMultiplier
  );
  const [showDetails, setShowDetails] = useState(true);
  const [tableData, setTableData] = useState([]);

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
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: colors.primaryBackground,
      padding: "20px",
      borderRadius: "8px",
      maxWidth: "600px",
      maxHeight: "80vh",
      overflow: "auto",
      color: colors.primaryText,
    },
    modalButtons: {
      display: "flex",
      gap: "10px",
      justifyContent: "flex-end",
      marginTop: "20px",
    },
  };

  const translations = {
    en: {
      selectSubmission: "Select a submission",
      slowness: "Slowness",
      fillForm: "Fill Form",
      submitAndDownload: "Submit and Download PDF",
    },
    de: {
      selectSubmission: "Einreichung auswählen",
      slowness: "Geschwindigkeit",
      fillForm: "Formular ausfüllen",
      submitAndDownload: "Absenden und PDF herunterladen",
    },
  };

  useEffect(() => {
    if (webviewRef.current) {
      const webview = webviewRef.current;

      webview.addEventListener("did-finish-load", () => {
        log("Webview finished loading");
        setIsWebviewReady(true);
        webview.setZoomLevel(-1.8);
      });

      // Cleanup listener on unmount
      return () => {
        webview.removeEventListener("did-finish-load", () => {
          setIsWebviewReady(true);
        });
      };
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tables = await seaTableService.getMetadata();
        // console.log("Tables:", tables);
        // Once we know the table name, we can fetch the actual data
        // const data = await seaTableService.getTableData();
        // setTableData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFillForm = () => {
    setShowDetails(false);
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

  return (
    <div style={styles.container}>
      <div style={styles.controlsRow}>
        <select
          style={styles.select}
          onChange={(e) =>
            setCurrentSubmission(
              submissions.find((s) => s.id === e.target.value)
            )
          }
          value={currentSubmission?.id || ""}
        >
          <option value="">{translations[language].selectSubmission}</option>
          {submissions.map((submission) => (
            <option key={submission.id} value={submission.id}>
              {`${submission.vorname} ${submission.nachname}`}
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
        webpreferences="contextIsolation=true, nodeIntegration=false"
      />
    </div>
  );
}

export default FormViewer;
