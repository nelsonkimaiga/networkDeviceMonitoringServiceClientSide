import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Plus, RefreshCcw, AlertTriangle, ChevronRight, Activity } from 'lucide-react';
import { deviceApi } from '../api/deviceApi';
import type { DeviceSummary } from '../types';
import { LoadingSpinner, ErrorAlert, StatusBadge } from '../components/Common';
import { RegistrationModal } from '../components/RegistrationModal';
import { DeviceDetailsModal } from '../components/DeviceDetailsModal';

export const Dashboard: React.FC = () => {
  const [devices, setDevices] = useState<DeviceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const fetchDevices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await deviceApi.getDashboard();
      setDevices(data);
    } catch (err) {
      setError('Unable to reach the monitoring service. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center">
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDevices}
            className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
            title="Refresh"
          >
            <RefreshCcw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <Plus className="h-5 w-5 mr-2" />
            Register New Device
          </button>
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading && devices.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Device Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Check-in</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {devices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                      No network devices found. Register a device to start.
                    </td>
                  </tr>
                ) : (
                  devices.map((device) => (
                    <tr
                      key={device.id}
                      onClick={() => setSelectedDeviceId(device.id)}
                      className="group hover:bg-blue-50/30 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{device.name}</div>
                        <div className="text-[10px] font-mono text-slate-400 tracking-tighter">{device.id}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                          {device.deviceType}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={device.currentStatus} />
                          {device.stale && (
                            <span className="flex items-center bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[10px] font-black border border-orange-200 animate-pulse">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              STALE
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-xs font-medium text-slate-700">
                          {device.lastReportAt
                            ? format(new Date(device.lastReportAt), 'MMM dd, HH:mm')
                            : 'Never Reported'}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="text-slate-300 group-hover:text-blue-500 transition-colors">
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDevices}
      />

      <DeviceDetailsModal
        deviceId={selectedDeviceId}
        onClose={() => setSelectedDeviceId(null)}
      />
    </div>
  );
};
