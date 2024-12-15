class LoggingService {
  constructor() {
    this.apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
    this.baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
    this.tableId = "tblwfZBP2Z5x6Q6Ah";

    console.log("Airtable logging initialized");
  }

  async logAction(sessionId, action, status, error = null) {
    try {
      const timestamp = new Date().toISOString();
      const errorDetails = error ? {
        message: error.message || error.toString(),
        stack: error.stack,
        code: error.code,
        name: error.name
      } : null;

      const payload = {
        records: [
          {
            fields: {
              Name: `${action} - ${sessionId}`,
              Notes: errorDetails 
                ? `Status: ${status}\nSession ID: ${sessionId}\nTimestamp: ${timestamp}\nError Details:\n${JSON.stringify(errorDetails, null, 2)}`
                : `Status: ${status}\nSession ID: ${sessionId}\nTimestamp: ${timestamp}`,
              Status: status,
              SessionId: sessionId,
              Action: action,
              Timestamp: timestamp,
              ErrorMessage: errorDetails?.message || null,
              ErrorStack: errorDetails?.stack || null
            }
          }
        ]
      };

      console.log("Sending to Airtable:", payload);

      const response = await fetch(
        `https://api.airtable.com/v0/${this.baseId}/${this.tableId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload)
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Airtable error response:", responseData);
        throw new Error(`Airtable API error: ${response.status} - ${JSON.stringify(responseData)}`);
      }

      return responseData;
    } catch (err) {
      console.error("Failed to log to Airtable:", err);
      // Optionally, you could try to log this failure somewhere else
      // or retry the logging operation
    }
  }
}

export const loggingService = new LoggingService();
