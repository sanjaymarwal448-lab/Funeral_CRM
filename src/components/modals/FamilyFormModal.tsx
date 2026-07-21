import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Family } from '../../types/crm';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Family | null;
}

export const FamilyFormModal: React.FC<Props> = ({ isOpen, onClose, initialData }) => {
  const { addFamily, updateFamily } = useCRM();

  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Next of Kin');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRelationship(initialData.relationship);
      setPhone(initialData.phone);
      setEmail(initialData.email);
      setAddress(initialData.address);
      setNotes(initialData.notes);
    } else {
      setName('');
      setRelationship('Next of Kin');
      setPhone('');
      setEmail('');
      setAddress('');
      setNotes('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Family Contact Name is required';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email address is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (initialData) {
      updateFamily(initialData.id, {
        name,
        relationship,
        phone,
        email,
        address,
        notes
      });
    } else {
      addFamily({
        name,
        relationship,
        phone,
        email,
        address,
        notes
      });
    }
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '520px' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-subtle)' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700 }}>{initialData ? 'Edit Family Record' : 'Register New Family Contact'}</h3>
          <button className="btn btn-ghost btn-icon-only" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="input-group">
            <label className="input-label">Family Contact Name *</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Sterling Family (Arthur Sterling)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <span style={{ color: '#e11d48', fontSize: '11px' }}>{errors.name}</span>}
          </div>

          <div className="input-group">
            <label className="input-label">Relationship to Deceased</label>
            <select className="input-field" value={relationship} onChange={(e) => setRelationship(e.target.value)}>
              <option value="Next of Kin">Next of Kin</option>
              <option value="Spouse">Spouse</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Parent">Parent</option>
              <option value="Sibling">Sibling</option>
              <option value="Executor">Executor</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="input-group">
              <label className="input-label">Phone Number *</label>
              <input
                type="tel"
                className="input-field"
                placeholder="(206) 555-0199"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <span style={{ color: '#e11d48', fontSize: '11px' }}>{errors.phone}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">Email Address *</label>
              <input
                type="email"
                className="input-field"
                placeholder="arthur@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span style={{ color: '#e11d48', fontSize: '11px' }}>{errors.email}</span>}
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Mailing Address</label>
            <input
              type="text"
              className="input-field"
              placeholder="1420 Highland Dr, Seattle, WA 98109"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Special Communication Notes</label>
            <textarea
              className="input-field"
              rows={2}
              placeholder="Communication preferences, family requests..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{initialData ? 'Save Changes' : 'Create Family Record'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
