import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { CalendarEvent } from '../../types/crm';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CalendarEvent | null;
}

export const CalendarEventModal: React.FC<Props> = ({ isOpen, onClose, initialData }) => {
  const { addCalendarEvent, updateCalendarEvent, cases, staff } = useCRM();

  const [title, setTitle] = useState('');
  const [caseId, setCaseId] = useState('');
  const [startDate, setStartDate] = useState('2026-07-23');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('12:00 PM');
  const [type, setType] = useState<CalendarEvent['type']>('Funeral');
  const [location, setLocation] = useState('Main Chapel - Grace Memorial');
  const [staffName, setStaffName] = useState(staff[0]?.name || 'Marcus Vance');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCaseId(initialData.caseId || '');
      setStartDate(initialData.startDate);
      setStartTime(initialData.startTime);
      setEndTime(initialData.endTime);
      setType(initialData.type);
      setLocation(initialData.location);
      setStaffName(initialData.staffName);
    } else {
      setTitle('');
      setCaseId('');
      setStartDate('2026-07-23');
      setStartTime('10:00 AM');
      setEndTime('12:00 PM');
      setType('Funeral');
      setLocation('Main Chapel - Grace Memorial');
      setStaffName(staff[0]?.name || 'Marcus Vance');
    }
  }, [initialData, isOpen, staff]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const linkedCase = cases.find(c => c.id === caseId);

    if (initialData) {
      updateCalendarEvent(initialData.id, {
        title,
        caseId,
        caseNumber: linkedCase?.caseNumber,
        deceasedName: linkedCase?.deceasedName,
        startDate,
        startTime,
        endTime,
        type,
        location,
        staffName
      });
    } else {
      addCalendarEvent({
        title,
        caseId,
        caseNumber: linkedCase?.caseNumber,
        deceasedName: linkedCase?.deceasedName,
        startDate,
        startTime,
        endTime,
        type,
        location,
        staffName
      });
    }
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '520px' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-subtle)' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700 }}>{initialData ? 'Edit Service Event' : 'Schedule New Service Event'}</h3>
          <button className="btn btn-ghost btn-icon-only" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="input-group">
            <label className="input-label">Event Title / Description *</label>
            <input
              type="text"
              className="input-field"
              required
              placeholder="e.g. Funeral Service: Eleanor Vance Sterling"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="input-group">
              <label className="input-label">Linked Case (Optional)</label>
              <select className="input-field" value={caseId} onChange={(e) => setCaseId(e.target.value)}>
                <option value="">-- None / General Event --</option>
                {cases.map(c => (
                  <option key={c.id} value={c.id}>{c.caseNumber} - {c.deceasedName}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Service Type</label>
              <select className="input-field" value={type} onChange={(e) => setType(e.target.value as any)}>
                <option value="Funeral">Funeral</option>
                <option value="Viewing">Viewing</option>
                <option value="Burial">Burial</option>
                <option value="Cremation">Cremation</option>
                <option value="Family Meeting">Family Meeting</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div className="input-group">
              <label className="input-label">Date</label>
              <input
                type="date"
                className="input-field"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Start Time</label>
              <input
                type="text"
                className="input-field"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">End Time</label>
              <input
                type="text"
                className="input-field"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="input-group">
              <label className="input-label">Location / Pavilion</label>
              <input
                type="text"
                className="input-field"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Assigned Staff Lead</label>
              <select className="input-field" value={staffName} onChange={(e) => setStaffName(e.target.value)}>
                {staff.map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.position})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{initialData ? 'Save Changes' : 'Schedule Event'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
