import React, { useState } from 'react';
import { X } from 'lucide-react';
import { deviceApi } from '../api/deviceApi';
import type { DeviceType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEVICE_TYPES: DeviceType[] = ['CPE', 'ROUTER', 'SWITCH', 'ACCESS_POINT', 'FIREWALL', 'ONT'];

export const RegistrationModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    deviceType: 'ROUTER' as DeviceType,
    ipAddress: '',
    location: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await deviceApi.registerDevice(formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register device. Check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 flex justify-between items-center text-white">
          <h2 className="font-bold text-lg">Register New Device</h2>
          <button onClick={onClose} className="hover:text-slate-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">{error}</div>}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Device Name</label>
            <input
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="device name"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Type</label>
            <select
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
              value={formData.deviceType}
              onChange={e => setFormData({ ...formData, deviceType: e.target.value as DeviceType })}
            >
              {DEVICE_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">IP Address</label>
            <input
              required
              pattern="^(\d{1,3}\.){3}\d{1,3}$"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.ipAddress}
              onChange={e => setFormData({ ...formData, ipAddress: e.target.value })}
              placeholder="hostname or ip address"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Site</label>
            <input
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              placeholder="location"
            />
          </div>

          <button
            disabled={submitting}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {submitting ? 'Processing...' : 'Register Device'}
          </button>
        </form>
      </div>
    </div>
  );
};
