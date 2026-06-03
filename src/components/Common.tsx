import React from 'react';
import { Loader2, AlertCircle, X } from 'lucide-react';

interface AlertProps {
  message: string;
  onClose?: () => void;
}

export const ErrorAlert: React.FC<AlertProps> = ({ message, onClose }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 flex justify-between items-start">
    <div className="flex">
      <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
      <div>
        <p className="text-sm text-red-700 font-medium">Error</p>
        <p className="text-sm text-red-600">{message}</p>
      </div>
    </div>
    {onClose && (
      <button onClick={onClose} className="text-red-500 hover:text-red-700">
        <X className="h-5 w-5" />
      </button>
    )}
  </div>
);

export const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-12">
    <Loader2 className="h-10 w-10 text-slate-400 animate-spin mb-4" />
    <p className="text-slate-500 text-sm font-medium">Loading device details...</p>
  </div>
);

export const StatusBadge: React.FC<{ status: string | null }> = ({ status }) => {
  const configs: Record<string, string> = {
    ONLINE: 'bg-green-100 text-green-800 border-green-200',
    OFFLINE: 'bg-red-100 text-red-800 border-red-200',
    DEGRADED: 'bg-amber-100 text-amber-800 border-amber-200',
    UNKNOWN: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  const current = status || 'UNKNOWN';
  const style = configs[current] || configs.UNKNOWN;

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${style}`}>
      {current}
    </span>
  );
};
