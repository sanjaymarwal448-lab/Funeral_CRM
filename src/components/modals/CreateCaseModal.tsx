import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { ServiceType } from '../../types/crm';
import { X } from 'lucide-react';

export const CreateCaseModal: React.FC = () => {
  const { isCreateCaseModalOpen, setIsCreateCaseModalOpen, addCase, staff } = useCRM();

  const [deceasedName, setDeceasedName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dateOfDeath, setDateOfDeath] = useState('');
  const [placeOfDeath, setPlaceOfDeath] = useState('');
  const [primaryContactName, setPrimaryContactName] = useState('');
  const [relationship, setRelationship] = useState('Spouse');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('Traditional Funeral');
  const [funeralDate, setFuneralDate] = useState('');
  const [funeralTime, setFuneralTime] = useState('10:00 AM');
  const [location, setLocation] = useState('Main Chapel - Grace Memorial');
  const [assignedStaffId, setAssignedStaffId] = useState(staff[0]?.id || '');
  const [estimatedCost, setEstimatedCost] = useState(6500);

  if (!isCreateCaseModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deceasedName || !primaryContactName) return;

    const assigned = staff.find(s => s.id === assignedStaffId);

    addCase({
      deceasedName,
      dateOfBirth,
      dateOfDeath,
      placeOfDeath,
      primaryContactId: `fam-${Date.now()}`,
      primaryContactName,
      relationship,
      phone,
      email,
      serviceType,
      funeralDate,
      funeralTime,
      location,
      assignedStaffId,
      assignedStaffName: assigned?.name || 'Marcus Vance',
      status: 'Active',
      estimatedCost: Number(estimatedCost),
      paidAmount: 0
    });

    setIsCreateCaseModalOpen(false);
    setDeceasedName('');
    setPrimaryContactName('');
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '650px' }}>
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-subtle)'
          }}
        >
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Initiate New Funeral Case</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>First call registration and arrangement details</p>
          </div>
          <button className="btn btn-ghost btn-icon-only" onClick={() => setIsCreateCaseModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--primary-accent)', marginBottom: '12px', letterSpacing: '0.04em' }}>
              Deceased Information
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Deceased Full Name *</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder="e.g. Margaret Ann Hollingsworth"
                  value={deceasedName}
                  onChange={(e) => setDeceasedName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Date of Birth</label>
                <input
                  type="date"
                  className="input-field"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Date of Death</label>
                <input
                  type="date"
                  className="input-field"
                  value={dateOfDeath}
                  onChange={(e) => setDateOfDeath(e.target.value)}
                />
              </div>

              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Place of Death</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Swedish Hospital, Seattle, WA"
                  value={placeOfDeath}
                  onChange={(e) => setPlaceOfDeath(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--primary-accent)', marginBottom: '12px', letterSpacing: '0.04em' }}>
              Family Primary Contact
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="input-group">
                <label className="input-label">Contact Name *</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder="e.g. Jonathan Hollingsworth"
                  value={primaryContactName}
                  onChange={(e) => setPrimaryContactName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Relationship to Deceased</label>
                <select
                  className="input-field"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Executor / Legal Rep">Executor / Legal Rep</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input
                  type="tel"
                  className="input-field"
                  placeholder="(206) 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="j.hollingsworth@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--primary-accent)', marginBottom: '12px', letterSpacing: '0.04em' }}>
              Service & Assignment
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="input-group">
                <label className="input-label">Service Type</label>
                <select
                  className="input-field"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as ServiceType)}
                >
                  <option value="Traditional Funeral">Traditional Funeral</option>
                  <option value="Direct Cremation">Direct Cremation</option>
                  <option value="Memorial Service">Memorial Service</option>
                  <option value="Graveside Burial">Graveside Burial</option>
                  <option value="Celebration of Life">Celebration of Life</option>
                  <option value="Repatriation">Repatriation</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Assigned Funeral Director</label>
                <select
                  className="input-field"
                  value={assignedStaffId}
                  onChange={(e) => setAssignedStaffId(e.target.value)}
                >
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.position})</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Proposed Funeral Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={funeralDate}
                  onChange={(e) => setFuneralDate(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Estimated Service Cost ($)</label>
                <input
                  type="number"
                  className="input-field"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsCreateCaseModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Case File
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
