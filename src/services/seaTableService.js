import SEATABLE_CONFIG from '../config/seatable';

class SeaTableService {
  constructor() {
    this.baseToken = null;
    this.baseInfo = null;
    this.tokenExpiryTime = null;
  }

  isTokenExpired() {
    return !this.tokenExpiryTime || 
           (this.tokenExpiryTime - Date.now()) < (60 * 60 * 1000);
  }

  async initialize() {
    if (this.isTokenExpired()) {
      try {
        // Include base name in the URL path
        const url = `${SEATABLE_CONFIG.SERVER_URL}/api/v2.1/dtable/${SEATABLE_CONFIG.BASE_NAME}/app-access-token/`;
        
        console.log('Attempting to connect to:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${SEATABLE_CONFIG.API_TOKEN.trim()}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers));
        
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        if (!response.ok) {
          throw new Error(`SeaTable API Error (${response.status}): ${responseText}`);
        }

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          throw new Error(`Failed to parse response as JSON: ${responseText.substring(0, 200)}...`);
        }

        this.baseToken = data.access_token;
        this.baseInfo = {
          dtableUuid: data.dtable_uuid,
          dtableServer: data.dtable_server,
          workspaceId: SEATABLE_CONFIG.WORKSPACE_ID,
        };
        
        this.tokenExpiryTime = Date.now() + (2.5 * 24 * 60 * 60 * 1000);
        console.log('Successfully initialized SeaTable connection');
      } catch (error) {
        console.error('Failed to initialize SeaTable API:', error);
        throw error;
      }
    }
    return this.baseInfo;
  }

  async listRows(tableName, options = {}) {
    if (!this.baseToken) {
      await this.initialize();
    }

    try {
      const response = await fetch(`${this.baseInfo.dtableServer}/api/v1/dtables/${this.baseInfo.dtableUuid}/rows/?table_name=${tableName}`, {
        headers: {
          'Authorization': `Token ${this.baseToken}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch rows:', error);
      throw error;
    }
  }

  async addRow(tableName, rowData) {
    if (!this.baseToken) {
      await this.initialize();
    }

    try {
      const response = await fetch(`${this.baseInfo.dtableServer}/api/v1/dtables/${this.baseInfo.dtableUuid}/rows/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.baseToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: tableName,
          row: rowData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to add row:', error);
      throw error;
    }
  }
}

const seaTableService = new SeaTableService();
export default seaTableService;