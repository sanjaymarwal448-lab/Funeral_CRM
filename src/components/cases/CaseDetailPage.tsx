import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Plus,
  FileText,
  CheckSquare,
  Upload,
  Download,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

interface Props {
  caseId: string;
  onBack: () => void;
}

export const CaseDetailPage: React.FC<Props> = ({ caseId, onBack }) => {
  const { cases, updateCaseStatus, timelineEvents, tasks, addTask, toggleTaskStatus, documents, addDocument, deleteDocument, notes, addNote } = useCRM();

  const caseData = cases.find(c => c.id === caseId) || cases[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'tasks' | 'documents' | 'notes'>('overview');

  // Interactive Form States for Tab Additions
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newDocName, setNewDocName] = useState('');
  const [newNoteText, setNewNoteText] = useState('');

  const caseTimeline = timelineEvents.filter(t => t.caseId === caseId);
  const caseTasks = tasks.filter(t => t.caseId === caseId);
  const caseDocs = documents.filter(d => d.caseId === caseId);
  const caseNotesList = notes.filter(n => n.caseId === caseId);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    addTask({
      caseId: caseData.id,
      caseName: caseData.deceasedName,
      title: newTaskTitle,
      assignedStaffName: caseData.assignedStaffName,
      dueDate: '2026-07-25',
      dueTime: '12:00 PM',
      priority: 'Medium',
      status: 'To Do'
    });
    setNewTaskTitle('');
  };

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;
    addDocument({
      caseId: caseData.id,
      caseName: caseData.deceasedName,
      name: newDocName.endsWith('.pdf') ? newDocName : `${newDocName}.pdf`,
      category: 'Contracts',
      size: '1.5 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      fileType: 'pdf'
    });
    setNewDocName('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText) return;
    addNote(caseData.id, newNoteText);
    setNewNoteText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button className="btn btn-secondary btn-icon-only" onClick={onBack} title="Back to Cases List">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800 }}>{caseData.deceasedName}</h2>
              <span className={`badge badge-${caseData.status === 'Active' ? 'active' : caseData.status === 'Service Scheduled' ? 'scheduled' : 'completed'}`}>
                <span className="badge-dot" /> {caseData.status}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Case #{caseData.caseNumber} • Created {caseData.createdAt} • Director: {caseData.assignedStaffName}
            </div>
          </div>
        </div>

        {/* Quick Status Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
          <select
            className="input-field"
            value={caseData.status}
            onChange={(e) => updateCaseStatus(caseData.id, e.target.value as any)}
            style={{ width: '180px', fontSize: '13px', fontWeight: 600 }}
          >
            <option value="Draft">Draft</option>
            <option value="Active">Active</option>
            <option value="Service Scheduled">Service Scheduled</option>
            <option value="In Transit">In Transit</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="tabs-nav">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>
          Timeline ({caseTimeline.length})
        </button>
        <button className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
          Tasks ({caseTasks.length})
        </button>
        <button className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>
          Documents ({caseDocs.length})
        </button>
        <button className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
          Notes ({caseNotesList.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Deceased Info */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Deceased Information</h3>
              </div>
              <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
                <div><strong>Full Name:</strong> {caseData.deceasedName}</div>
                <div><strong>Date of Birth:</strong> {caseData.dateOfBirth}</div>
                <div><strong>Date of Death:</strong> {caseData.dateOfDeath}</div>
                <div><strong>Place of Death:</strong> {caseData.placeOfDeath}</div>
              </div>
            </div>

            {/* Family Info */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Family Information</h3>
              </div>
              <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
                <div><strong>Primary Contact:</strong> {caseData.primaryContactName}</div>
                <div><strong>Relationship:</strong> {caseData.relationship}</div>
                <div><strong>Phone:</strong> {caseData.phone}</div>
                <div><strong>Email:</strong> {caseData.email}</div>
              </div>
            </div>

            {/* Service Info */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Service Details</h3>
              </div>
              <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
                <div><strong>Service Type:</strong> {caseData.serviceType}</div>
                <div><strong>Date & Time:</strong> {caseData.funeralDate} at {caseData.funeralTime}</div>
                <div><strong>Location:</strong> {caseData.location}</div>
                <div><strong>Assigned Staff:</strong> {caseData.assignedStaffName}</div>
              </div>
            </div>
          </div>

          {/* Financial Summary Box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>Financial Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Estimated Cost:</span>
                  <strong style={{ fontSize: '15px' }}>${caseData.estimatedCost.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Paid Amount:</span>
                  <strong style={{ color: '#047857' }}>${caseData.paidAmount.toLocaleString()}</strong>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Balance Remaining:</span>
                  <strong style={{ color: '#e11d48', fontSize: '16px' }}>
                    ${(caseData.estimatedCost - caseData.paidAmount).toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Case Activity Audit Trail</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '20px' }}>
            <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', backgroundColor: 'var(--border-color)' }} />
            {caseTimeline.map(t => (
              <div key={t.id} style={{ position: 'relative', paddingLeft: '16px' }}>
                <div style={{ position: 'absolute', left: '-19px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary-accent)', border: '2px solid white' }} />
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>{t.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-body)', marginTop: '2px' }}>{t.description}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '4px' }}>
                  {t.timestamp} • Logged by {t.author}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TASKS */}
      {activeTab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <form onSubmit={handleAddTask} className="card" style={{ padding: '16px', display: 'flex', gap: '12px' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Add a new task item for this case..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              <Plus size={16} /> Add Task
            </button>
          </form>

          <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {caseTasks.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="checkbox" checked={t.status === 'Completed'} onChange={() => toggleTaskStatus(t.id)} />
                  <span style={{ fontWeight: 600, fontSize: '14px', textDecoration: t.status === 'Completed' ? 'line-through' : 'none' }}>{t.title}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Assigned: {t.assignedStaffName}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DOCUMENTS */}
      {activeTab === 'documents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <form onSubmit={handleAddDoc} className="card" style={{ padding: '16px', display: 'flex', gap: '12px' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Mock Upload: Type document title (e.g. Autopsy_Release.pdf)"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              <Upload size={16} /> Upload Doc
            </button>
          </form>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {caseDocs.map(d => (
              <div key={d.id} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>{d.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{d.category} • {d.size}</div>
                </div>
                <button className="btn btn-ghost btn-icon-only" onClick={() => deleteDocument(d.id)} style={{ color: '#e11d48' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: NOTES */}
      {activeTab === 'notes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <form onSubmit={handleAddNote} className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Write a confidential arrangement note..."
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>
              Post Note
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {caseNotesList.map(n => (
              <div key={n.id} className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '13px' }}>{n.author}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{n.date} at {n.time}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-body)' }}>{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
