import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { X, Globe, MapPin, Calendar, Clock, Activity } from 'lucide-react';
import { deviceApi } from '../api/deviceApi';
import type { DeviceDetails } from '../types';
import { LoadingSpinner, ErrorAlert, StatusBadge } from './Common';

interface Props {
  deviceId: string | null;
  onClose: () => void;
}

export const DeviceDetailsModal: React.FC<Props> = ({ deviceId, onClose }) => {
  const [details, setDetails] = useState<DeviceDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (deviceId) {
      fetchDetails(deviceId);
    } else {
      setDetails(null);
    }
  }, [deviceId]);

  const fetchDetails = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await deviceApi.getDeviceDetails(id);
      setDetails(data);
    } catch (err) {
      setError('Failed to fetch telemetry data.');
    } finally {
      setLoading(false);
    }
  };

  if (!deviceId) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 bg-slate-900 flex justify-between items-center text-white">
          <div>
            <h2 className="font-bold text-lg">{details?.name || 'Device Monitoring'}</h2>
            <p className="text-[10px] font-mono text-slate-400">{deviceId}</p>
          </div>
          <button onClick={onClose} className="hover:text-slate-300 p-1">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading && <LoadingSpinner />}
          {error && <ErrorAlert message={error} />}

          {details && (
            <div className="space-y-8">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start">
                  <Globe className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">IP Address</span>
                    <p className="font-mono text-sm font-semibold">{details.ipAddress}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start">
                  <MapPin className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Site Location</span>
                    <p className="text-sm font-semibold">{details.location}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start">
                  <Activity className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Device Type</span>
                    <p className="text-sm font-semibold">{details.deviceType}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start">
                  <Calendar className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Registered</span>
                    <p className="text-sm font-semibold">{format(new Date(details.registeredAt), 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                </div>
              </div>

              {/* Status History */}
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 border-b pb-2">Recent Status Reports</h3>
                <div className="space-y-3">
                  {details.recentReports.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      <p className="text-slate-400 text-sm">No device history available.</p>
                    </div>
                  ) : (
                    details.recentReports.map(report => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <div className="flex items-center gap-4">
                          <StatusBadge status={report.status} />
                          <div>
                            <p className="text-xs font-medium text-slate-700">{report.message || 'Heartbeat signal received.'}</p>
                            <div className="flex items-center text-[10px] text-slate-400 mt-0.5">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(new Date(report.createdAt), 'MMM dd, HH:mm:ss')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
