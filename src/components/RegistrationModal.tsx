import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await deviceApi.registerDevice(formData);
      onSuccess();
      onClose();
      setFormData({
        name: '',
        deviceType: 'ROUTER',
        ipAddress: '',
        location: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register device. Check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton className="bg-dark text-white border-0">
        <Modal.Title className="fw-bold fs-5">Register New Device</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold text-muted text-uppercase tracking-wider">Device Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="e.g. Core Switch 01"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="bg-light border-0"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold text-muted text-uppercase tracking-wider">Type</Form.Label>
            <Form.Select
              value={formData.deviceType}
              onChange={e => setFormData({ ...formData, deviceType: e.target.value as DeviceType })}
              className="bg-light border-0"
            >
              {DEVICE_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold text-muted text-uppercase tracking-wider">IP Address</Form.Label>
            <Form.Control
              required
              type="text"
              pattern="^(\d{1,3}\.){3}\d{1,3}$"
              placeholder="192.168.1.1"
              value={formData.ipAddress}
              onChange={e => setFormData({ ...formData, ipAddress: e.target.value })}
              className="bg-light border-0"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-muted text-uppercase tracking-wider">Site Location</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="e.g. Data Center A"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="bg-light border-0"
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={submitting}
            className="w-full py-2 fw-bold shadow-sm"
          >
            {submitting ? 'Processing...' : 'Register Device'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
