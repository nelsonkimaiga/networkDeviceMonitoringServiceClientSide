import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Plus, RefreshCcw, AlertTriangle, ChevronRight } from 'lucide-react';
import { Container, Row, Col, Button, Table, Badge, Card } from 'react-bootstrap';
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
    <Container className="py-4">
      {/* Header Section */}
      <Row className="align-items-center mb-4 g-3">
        <Col md={true}>
          <h2 className="mb-0 fw-bold">Device Dashboard</h2>
        </Col>
        <Col md="auto" className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            onClick={fetchDevices}
            title="Refresh"
            className="d-flex align-items-center"
          >
            <RefreshCcw size={18} className={loading ? 'rotate-animation' : ''} />
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="d-flex align-items-center fw-bold"
          >
            <Plus size={18} className="me-2" />
            Register New Device
          </Button>
        </Col>
      </Row>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {/* Main Content Area */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          {loading && devices.length === 0 ? (
            <LoadingSpinner />
          ) : (
            <Table responsive hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 small text-uppercase fw-black text-muted" style={{ letterSpacing: '0.1em' }}>Device Name</th>
                  <th className="px-4 py-3 small text-uppercase fw-black text-muted" style={{ letterSpacing: '0.1em' }}>Type</th>
                  <th className="px-4 py-3 small text-uppercase fw-black text-muted" style={{ letterSpacing: '0.1em' }}>Current Status</th>
                  <th className="px-4 py-3 small text-uppercase fw-black text-muted" style={{ letterSpacing: '0.1em' }}>Registration Date</th>
                  <th className="px-4 py-3 text-end"></th>
                </tr>
              </thead>
              <tbody>
                {devices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-5 text-center text-muted">
                      No network devices found. Register a device to start.
                    </td>
                  </tr>
                ) : (
                  devices.map((device) => (
                    <tr
                      key={device.id}
                      onClick={() => setSelectedDeviceId(device.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className="px-4 py-3">
                        <div className="fw-bold text-dark">{device.name}</div>
                        <div className="small text-muted font-monospace">{device.id}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge bg="light" text="dark" className="border">
                          {device.deviceType}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-2">
                          <StatusBadge status={device.currentStatus} />
                          {device.stale && (
                            <Badge bg="warning" text="dark" className="d-flex align-items-center text-uppercase" style={{ fontSize: '10px' }}>
                              <AlertTriangle size={12} className="me-1" />
                              STALE
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="small fw-medium text-secondary">
                          {device.lastReportAt
                            ? format(new Date(device.lastReportAt), 'MMM dd, HH:mm')
                            : 'Not Available'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <ChevronRight size={20} className="text-muted" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDevices}
      />

      <DeviceDetailsModal
        deviceId={selectedDeviceId}
        onClose={() => setSelectedDeviceId(null)}
      />

      <style>{`
        .rotate-animation {
          animation: rotate 1s linear infinite;
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Container>
  );
};
