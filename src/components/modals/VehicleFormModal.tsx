import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Vehicle } from '../../types/crm';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Vehicle | null;
}

export const VehicleFormModal: React.FC<Props> = ({ isOpen, onClose, initialData }) => {
  const { addVehicle, updateVehicle, staff } = useCRM();

  const [name, setName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [type, setType] = useState<Vehicle['type']>('Hearse');
  const [driverName, setDriverName] = useState(staff[0]?.name || 'David Mercer');
  const [status, setStatus] = useState<Vehicle['status']>('Available');
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState('2026-08-15');
  const [mileage, setMileage] = useState('25,000 miles');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRegistrationNumber(initialData.registrationNumber);
      setType(initialData.type);
      setDriverName(initialData.driverName);
      setStatus(initialData.status);
      setNextMaintenanceDate(initialData.nextMaintenanceDate);
      setMileage(initialData.mileage);
    } else {
      setName('');
      setRegistrationNumber('');
      setType('Hearse');
      setDriverName(staff[0]?.name || 'David Mercer');
      setStatus('Available');
      setNextMaintenanceDate('2026-08-15');
      setMileage('25,000 miles');
    }
  }, [initialData, isOpen, staff]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !registrationNumber) return;

    const defaultPhoto = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80';

    if (initialData) {
      updateVehicle(initialData.id, {
        name,
        registrationNumber,
        type,
        driverName,
        status,
        nextMaintenanceDate,
        mileage
      });
    } else {
      addVehicle({
        name,
        registrationNumber,
        type,
        photo: defaultPhoto,
        driverName,
        status,
        nextMaintenanceDate,
        mileage
      });
    }
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '500px' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-subtle)' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700 }}>{initialData ? 'Edit Fleet Vehicle' : 'Register New Fleet Vehicle'}</h3>
          <button className="btn btn-ghost btn-icon-only" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="input-group">
            <label className="input-label">Vehicle Name / Make Model *</label>
            <input
              type="text"
              className="input-field"
              required
              placeholder="e.g. Cadillac XTS Eagle Hearse"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="input-group">
              <label className="input-label">Registration / Plate # *</label>
              <input
                type="text"
                className="input-field"
                required
                placeholder="e.g. WA-772-FHC"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Vehicle Type</label>
              <select className="input-field" value={type} onChange={(e) => setType(e.target.value as any)}>
                <option value="Hearse">Hearse</option>
                <option value="Limousine">Limousine</option>
                <option value="Transfer Van">Transfer Van</option>
                <option value="First Call Vehicle">First Call Vehicle</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="input-group">
              <label className="input-label">Assigned Lead Driver</label>
              <select className="input-field" value={driverName} onChange={(e) => setDriverName(e.target.value)}>
                {staff.map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.role})</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Operational Status</label>
              <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                <option value="Available">Available</option>
                <option value="In Service">In Service</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="input-group">
              <label className="input-label">Next Service Date</label>
              <input
                type="date"
                className="input-field"
                value={nextMaintenanceDate}
                onChange={(e) => setNextMaintenanceDate(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Odometer Mileage</label>
              <input
                type="text"
                className="input-field"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{initialData ? 'Save Changes' : 'Register Vehicle'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
