import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { Modal, ListGroup, Badge, Row, Col } from 'react-bootstrap';
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

  return (
    <Modal show={!!deviceId} onHide={onClose} size="lg" centered scrollable>
      <Modal.Header closeButton className="bg-dark text-white border-0">
        <Modal.Title>
          <div className="fw-bold fs-5">{details?.name || 'Device Details'}</div>
          <div className="small font-monospace text-muted" style={{ fontSize: '10px' }}>{deviceId}</div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4 bg-light">
        {loading && <LoadingSpinner />}
        {error && <ErrorAlert message={error} />}

        {details && (
          <div className="space-y-4">
            {/* Metadata Section */}
            <div className="bg-white p-3 rounded shadow-sm mb-4">
              <ListGroup variant="flush">
                {[
                  { label: 'IP Address', value: details.ipAddress, mono: true },
                  { label: 'Physical Site', value: details.location },
                  { label: 'Device Name', value: details.name },
                  { label: 'Device Type', value: details.deviceType },
                  { label: 'Registration Date', value: format(new Date(details.registeredAt), 'MMMM dd, yyyy HH:mm') },
                ].map((item, idx) => (
                  <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center px-0 py-2 border-light">
                    <span className="small text-muted text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>{item.label}</span>
                    <span className={`fw-semibold ${item.mono ? 'font-monospace' : ''}`}>{item.value}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>

            {/* Status History */}
            <h6 className="small text-muted text-uppercase fw-black tracking-widest mb-3" style={{ fontSize: '10px' }}>Device status History</h6>
            <div className="space-y-2">
              {details.recentReports.length === 0 ? (
                <div className="text-center py-5 bg-white rounded border border-dashed">
                  <p className="text-muted small mb-0">No device history available.</p>
                </div>
              ) : (
                details.recentReports.map(report => (
                  <div key={report.id} className="bg-white p-3 rounded border border-light shadow-sm mb-2">
                    <Row className="align-items-center">
                      <Col xs="auto">
                        <StatusBadge status={report.status} />
                      </Col>
                      <Col>
                        <div className="fw-semibold small text-dark">{report.message || 'Standard heartbeat.'}</div>
                        <div className="d-flex align-items-center text-muted mt-1" style={{ fontSize: '10px' }}>
                          <Clock size={10} className="me-1" />
                          {format(new Date(report.createdAt), 'MMM dd, HH:mm:ss')}
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};
