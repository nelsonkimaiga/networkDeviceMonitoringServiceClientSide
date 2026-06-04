import React from 'react';
import { Alert, Spinner, Badge } from 'react-bootstrap';
import { AlertCircle } from 'lucide-react';

interface AlertProps {
  message: string;
  onClose?: () => void;
}

export const ErrorAlert: React.FC<AlertProps> = ({ message, onClose }) => (
  <Alert variant="danger" onClose={onClose} dismissible={!!onClose} className="d-flex align-items-center">
    <AlertCircle className="me-2" size={20} />
    <div>
      <div className="fw-bold">Error</div>
      <div>{message}</div>
    </div>
  </Alert>
);

export const LoadingSpinner: React.FC = () => (
  <div className="d-flex flex-column align-items-center justify-content-center p-5">
    <Spinner animation="border" variant="secondary" className="mb-3" />
    <p className="text-muted small fw-medium">Loading device details...</p>
  </div>
);

export const StatusBadge: React.FC<{ status: string | null }> = ({ status }) => {
  const configs: Record<string, "success" | "danger" | "warning" | "secondary"> = {
    ONLINE: 'success',
    OFFLINE: 'danger',
    DEGRADED: 'warning',
    UNKNOWN: 'secondary',
  };

  const current = status || 'UNKNOWN';
  const variant = configs[current] || configs.UNKNOWN;

  return (
    <Badge pill bg={variant} className="px-2 py-1">
      {current}
    </Badge>
  );
};
