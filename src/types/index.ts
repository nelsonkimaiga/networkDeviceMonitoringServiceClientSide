export type DeviceType = 'CPE' | 'ROUTER' | 'SWITCH' | 'ACCESS_POINT' | 'FIREWALL' | 'ONT';
export type OperationalStatus = 'ONLINE' | 'OFFLINE' | 'DEGRADED';

export interface DeviceSummary {
  id: string;
  name: string;
  deviceType: DeviceType;
  currentStatus: OperationalStatus | null;
  lastReportAt: string | null;
  stale: boolean;
}

export interface ReportSummary {
  id: string;
  status: OperationalStatus;
  message: string | null;
  createdAt: string;
}

export interface DeviceDetails {
  id: string;
  name: string;
  deviceType: DeviceType;
  ipAddress: string;
  location: string;
  registeredAt: string;
  recentReports: ReportSummary[];
}

export interface DeviceRegistrationRequest {
  name: string;
  deviceType: DeviceType;
  ipAddress: string;
  location: string;
}

export interface StatusReportRequest {
  status: OperationalStatus;
  message: string;
}
