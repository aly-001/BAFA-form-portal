So here we have a form filler application that runs with electron with react so the goal is is you? It’s calling these data from sea table and then we’ll get select one of them fill form and it fills the form and so it’s using like a Web view that has the form information and then we’re taking that data from sea table and putting it into each field so it works great right now it’s just the only problem is that there’s no really way to mark as done so we need to add some more functionality what we’re gonna do is we’re going to Had a mark as done button that pops up after the person clicks fill for him after selecting a submission so then this mark is done what it does is it adds a new property to the data from sea table and then it also reload the page and we also need to include the functionality that we’re selecting from the drop-down Any entry with that field that just got added does not show up.


The field is called "beantragt am" and it's a date field.

So in summary:

- dropdown excludes any entry with that field full
- "mark as done" button pops up after submit
- adds the date to the field after clicking button
- reloads the page after clicking button
I'm going to attach relevant parts of my code.

Here's the code that contains the webview:

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
        allowpopups="true"
        webpreferences="contextIsolation=true, nodeIntegration=false"
      />
    </div>
  );
}

export default FormViewer;


Here's the seatable service:

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
}

export const seaTableService = new SeaTableService();

here's main

const { app, BrowserWindow, session } = require('electron')
const path = require('path')
// Force production mode when packaged
const isDev = !app.isPackaged

const log = (...args) => {
    if (!app.isPackaged) {  // Only log in development
        console.log(...args);
    }
};

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 1400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true
        }
    })

    // Enhanced download handler with popup management
    session.defaultSession.on('will-download', (event, item, webContents) => {
        log('Download initiated:', item.getURL());
        
        // Get reference to the popup window that initiated the download
        const popup = BrowserWindow.fromWebContents(webContents);
        
        // Get user's downloads directory
        const downloadsPath = app.getPath('downloads');
        const filename = item.getFilename();
        const savePath = path.join(downloadsPath, filename);
        
        log('Saving to:', savePath);
        item.setSavePath(savePath);

        item.on('updated', (event, state) => {
            if (state === 'interrupted') {
                log('Download interrupted:', filename);
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    log('Download paused:', filename);
                } else {
                    const percent = item.getReceivedBytes() / item.getTotalBytes() * 100;
                    log(`Download progress: ${Math.round(percent)}%`);
                }
            }
        });

        item.on('done', (event, state) => {
            if (state === 'completed') {
                log('Download completed:', filename);
                // Notify the renderer process
                webContents.send('download-completed', {
                    filename,
                    path: savePath
                });
            } else {
                log(`Download failed: ${state}`, filename);
            }

            // Close the popup window if it exists and isn't destroyed
            if (popup && !popup.isDestroyed()) {
                log('Closing popup window...');
                popup.close();
            }
        });
    });

    // Add request interceptor for PDFs
    session.defaultSession.webRequest.onBeforeRequest(
        { urls: ['*://*/*'] },
        (details, callback) => {
            if (details.url.endsWith('.pdf') || details.url.includes('?__blob=publicationFile')) {
                log('Intercepted PDF request:', details.url);
            }
            callback({});
        }
    );

    if (isDev) {
        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools()
    } else {
        const indexPath = path.join(__dirname, 'dist', 'index.html')
        console.log('Loading from:', indexPath)
        console.log('Current directory:', __dirname)
        console.log('File exists:', require('fs').existsSync(indexPath))
        
        win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
            console.error('Failed to load:', errorCode, errorDescription);
        });

        win.webContents.on('dom-ready', () => {
            console.log('DOM Ready');
            console.log('Current URL:', win.webContents.getURL());
        });

        // win.webContents.openDevTools()
        win.loadFile(indexPath)
    }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})