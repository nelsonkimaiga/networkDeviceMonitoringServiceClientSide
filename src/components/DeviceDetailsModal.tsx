import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { X, Clock } from 'lucide-react';
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
            <h2 className="font-bold text-lg">{details?.name}</h2>
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
              {/* Line Item Metadata */}
              <div className="space-y-3 border-b pb-6">
                <div className="flex justify-between items-center text-sm py-1 border-b border-slate-50 last:border-0">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">IP Address</span>
                  <span className="font-mono font-semibold text-slate-700">{details.ipAddress}</span>
                </div>
                <div className="flex justify-between items-center text-sm py-1 border-b border-slate-50 last:border-0">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Physical Site</span>
                  <span className="font-semibold text-slate-700">{details.location}</span>
                </div>
                <div className="flex justify-between items-center text-sm py-1 border-b border-slate-50 last:border-0">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Device Name</span>
                  <span className="font-semibold text-slate-700">{details.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm py-1 border-b border-slate-50 last:border-0">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Device Type</span>
                  <span className="font-semibold text-slate-700">{details.deviceType}</span>
                </div>
                <div className="flex justify-between items-center text-sm py-1 border-b border-slate-50 last:border-0">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Registration Date</span>
                  <span className="font-semibold text-slate-700">{format(new Date(details.registeredAt), 'MMMM dd, yyyy HH:mm')}</span>
                </div>
              </div>

              {/* Status History */}
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Device status History</h3>
                <div className="space-y-2">
                  {details.recentReports.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      <p className="text-slate-400 text-sm">No device history available.</p>
                    </div>
                  ) : (
                    details.recentReports.map(report => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                        <div className="flex items-center gap-4">
                          <StatusBadge status={report.status} />
                          <div>
                            <p className="text-xs font-semibold text-slate-700">{report.message || 'Standard heartbeat.'}</p>
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
