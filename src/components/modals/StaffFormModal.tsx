import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { StaffMember } from '../../types/crm';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: StaffMember | null;
}

export const StaffFormModal: React.FC<Props> = ({ isOpen, onClose, initialData }) => {
  const { addStaff, updateStaff } = useCRM();

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [role, setRole] = useState<StaffMember['role']>('Funeral Director');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<StaffMember['status']>('Active');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPosition(initialData.position);
      setRole(initialData.role);
      setEmail(initialData.email);
      setPhone(initialData.phone);
      setStatus(initialData.status);
    } else {
      setName('');
      setPosition('');
      setRole('Funeral Director');
      setEmail('');
      setPhone('');
      setStatus('Active');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Full Name is required';
    if (!position.trim()) errs.position = 'Job Position is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid Email is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (initialData) {
      updateStaff(initialData.id, {
        name,
        position,
        role,
        email,
        phone,
        status
      });
    } else {
      addStaff({
        name,
        position,
        role,
        email,
        phone,
        status,
        photo: name.split(' ').map(n => n[0]).join('')
      });
    }
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '500px' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-subtle)' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700 }}>{initialData ? 'Edit Team Member Profile' : 'Add New Team Member'}</h3>
          <button className="btn btn-ghost btn-icon-only" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="input-group">
            <label className="input-label">Full Name *</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Marcus Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <span style={{ color: '#e11d48', fontSize: '11px' }}>{errors.name}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="input-group">
              <label className="input-label">Job Title / Position *</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Senior Director"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
              {errors.position && <span style={{ color: '#e11d48', fontSize: '11px' }}>{errors.position}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">System Access Role</label>
              <select className="input-field" value={role} onChange={(e) => setRole(e.target.value as any)}>
                <option value="Owner">Owner</option>
                <option value="Manager">Manager</option>
                <option value="Funeral Director">Funeral Director</option>
                <option value="Driver">Driver</option>
                <option value="Office Staff">Office Staff</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="input-group">
              <label className="input-label">Email Address *</label>
              <input
                type="email"
                className="input-field"
                placeholder="m.vance@elysiumfuneral.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span style={{ color: '#e11d48', fontSize: '11px' }}>{errors.email}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <input
                type="tel"
                className="input-field"
                placeholder="(206) 555-0101"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Status</label>
            <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value as any)}>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Off Duty">Off Duty</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{initialData ? 'Save Changes' : 'Add Employee'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
