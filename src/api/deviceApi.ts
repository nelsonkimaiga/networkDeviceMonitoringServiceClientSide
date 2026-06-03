import axios from 'axios';
import type { 
  DeviceRegistrationRequest, 
  DeviceSummary, 
  DeviceDetails, 
  StatusReportRequest 
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const deviceApi = {
  getDashboard: async (): Promise<DeviceSummary[]> => {
    const response = await api.get<DeviceSummary[]>('/devices/dashboard');
    return response.data;
  },

  getDeviceDetails: async (id: string): Promise<DeviceDetails> => {
    const response = await api.get<DeviceDetails>(`/devices/${id}`);
    return response.data;
  },

  registerDevice: async (data: DeviceRegistrationRequest): Promise<string> => {
    const response = await api.post<string>('/devices/register', data);
    return response.data;
  },

  submitReport: async (id: string, data: StatusReportRequest): Promise<string> => {
    const response = await api.post<string>(`/devices/${id}/reports`, data);
    return response.data;
  },
};
