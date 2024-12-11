import axios from 'axios';

const BASE_URL = 'https://cloud.seatable.io';
const AUTH_TOKEN = '9b3084c24fe8ae5b67fb7f465308df0a1b16d4d5';

class SeaTableService {
  constructor() {
    this.accessToken = null;
    this.dtableServer = null;
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
        url: `${BASE_URL}/api-gateway/api/v2/dtables/03fc6c69-fad8-4091-b911-01de9426383e/rows/`,
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
        url: `${BASE_URL}/api-gateway/api/v2/dtables/03fc6c69-fad8-4091-b911-01de9426383e/metadata/`,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        }
      });
      
      console.log('Available tables:', response.data.metadata.tables);
      return response.data.metadata.tables;
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
      throw error;
    }
  }
}

export const seaTableService = new SeaTableService();