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

  async getRowsWithoutTimestamp() {
    const allRows = await this.getTableData();
    // print all rows that don't have a timestamp
    // console.log(allRows.filter(row => !row["beantragt am"]));
    return allRows.filter(row => !row["beantragt am"]);
  }
}

export const seaTableService = new SeaTableService();