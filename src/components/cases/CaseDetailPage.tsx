import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Case, CaseTimelineEvent, CaseTask, CaseDocument, CaseNote, Invoice, ChatMessage } from '../../types/crm';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  DollarSign,
  FileText,
  CheckCircle2,
  Plus,
  Edit,
  Trash2,
  MessageSquare,
  Paperclip,
  CheckCheck,
  Send,
  Lock
} from 'lucide-react';

interface CaseDetailPageProps {
  caseId: string;
  onBack: () => void;
}

export const CaseDetailPage: React.FC<CaseDetailPageProps> = ({ caseId, onBack }) => {
  const {
    cases,
    timelineEvents,
    tasks,
    documents,
    notes,
    invoices,
    conversations,
    chatMessages,
    sendChatMessage,
    updateCaseStatus,
    openConfirmDialog,
    deleteCase,
    addNote,
    deleteNote,
    toggleTaskStatus,
    deleteTask,
    deleteDocument,
    markInvoiceStatus,
    setDrawerItem
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'family' | 'tasks' | 'documents' | 'notes' | 'invoices' | 'conversations'>('overview');
  const [newNoteText, setNewNoteText] = useState('');
  const [chatInput, setChatInput] = useState('');

  const activeCase = cases.find(c => c.id === caseId);

  if (!activeCase) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h3>Case File Not Found</h3>
        <button className="btn btn-secondary" onClick={onBack} style={{ marginTop: '16px' }}>Back to Cases List</button>
      </div>
    );
  }

  const caseTimeline = timelineEvents.filter(te => te.caseId === caseId);
  const caseTasks = tasks.filter(t => t.caseId === caseId);
  const caseDocs = documents.filter(d => d.caseId === caseId);
  const caseNotes = notes.filter(n => n.caseId === caseId);
  const caseInvoices = invoices.filter(i => i.caseId === caseId);

  // Case Linked Conversation & Messages
  const caseConv = conversations.find(c => c.caseId === caseId) || conversations[0];
  const caseMessages = caseConv ? chatMessages.filter(m => m.conversationId === caseConv.id) : [];

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addNote(caseId, newNoteText);
    setNewNoteText('');
  };

  const handleSendCaseChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !caseConv) return;
    sendChatMessage(caseConv.id, chatInput, 'WhatsApp');
    setChatInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Breadcrumb & Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-secondary btn-sm" onClick={onBack} style={{ gap: '6px' }}>
          <ArrowLeft size={14} /> Back to Cases List
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-ghost btn-sm"
            style={{ color: '#e11d48' }}
            onClick={() => {
              openConfirmDialog({
                title: `Delete Case #${activeCase.caseNumber}?`,
                message: `Are you sure you want to delete the file for ${activeCase.deceasedName}? This cannot be undone.`,
                confirmText: 'Delete Case',
                variant: 'danger',
                onConfirm: () => {
                  deleteCase(activeCase.id);
                  onBack();
                }
              });
            }}
          >
            <Trash2 size={14} /> Delete Case
          </button>
        </div>
      </div>

      {/* Hero Summary Card */}
      <div className="card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary-accent)', letterSpacing: '0.05em' }}>
              {activeCase.caseNumber}
            </span>
            <span className={`badge badge-${activeCase.status === 'Active' ? 'active' : activeCase.status === 'Service Scheduled' ? 'scheduled' : 'completed'}`}>
              <span className="badge-dot" /> {activeCase.status}
            </span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>
            {activeCase.deceasedName}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span><strong>DOB:</strong> {activeCase.dateOfBirth}</span>
            <span>•</span>
            <span><strong>DOD:</strong> {activeCase.dateOfDeath}</span>
            <span>•</span>
            <span><MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} /> {activeCase.placeOfDeath}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Assigned Funeral Director</div>
          <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>{activeCase.assignedStaffName}</div>
          <select
            className="input-field"
            value={activeCase.status}
            onChange={(e) => updateCaseStatus(activeCase.id, e.target.value as any)}
            style={{ fontSize: '12px', padding: '4px 8px', width: '160px', marginTop: '4px' }}
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
      <div style={{ borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '4px', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'timeline', label: `Timeline (${caseTimeline.length})` },
          { id: 'conversations', label: `Conversations (${caseMessages.length})` },
          { id: 'family', label: 'Family Contact' },
          { id: 'tasks', label: `Tasks (${caseTasks.length})` },
          { id: 'documents', label: `Documents (${caseDocs.length})` },
          { id: 'notes', label: `Director Notes (${caseNotes.length})` },
          { id: 'invoices', label: `Financials (${caseInvoices.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '10px 16px',
              fontWeight: 600,
              fontSize: '13px',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === tab.id ? 'var(--primary-accent)' : 'var(--text-muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary-accent)' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Rendering */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Service Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13px' }}>
                <div><strong>Service Package:</strong> {activeCase.serviceType}</div>
                <div><strong>Funeral Date:</strong> {activeCase.funeralDate} at {activeCase.funeralTime}</div>
                <div><strong>Service Location:</strong> {activeCase.location}</div>
                <div><strong>Case Created:</strong> {activeCase.createdAt}</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Primary Family Contact</h3>
            <div style={{ fontSize: '13px' }}>
              <div style={{ fontWeight: 700 }}>{activeCase.primaryContactName} ({activeCase.relationship})</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>{activeCase.phone}</div>
              <div style={{ color: 'var(--text-muted)' }}>{activeCase.email}</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setDrawerItem({ type: 'family', id: activeCase.primaryContactId })}>
              View Family Profile
            </button>
          </div>
        </div>
      )}

      {/* TIMELINE TAB */}
      {activeTab === 'timeline' && (
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Audit Log & Milestones</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {caseTimeline.map(tl => (
              <div key={tl.id} style={{ display: 'flex', gap: '14px', borderLeft: '2px solid var(--border-color)', paddingLeft: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{tl.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{tl.description}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '4px' }}>
                    {tl.timestamp} • By {tl.author}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONVERSATIONS TAB */}
      {activeTab === 'conversations' && (
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Case Communication Thread ({caseConv?.preferredChannel || 'WhatsApp'})</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Primary Contact: {activeCase.primaryContactName} ({activeCase.phone})</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '400px', overflowY: 'auto', backgroundColor: 'var(--bg-app)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            {caseMessages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.senderRole === 'staff' ? 'flex-end' : 'flex-start' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                  {msg.senderName} • {msg.timestamp} ({msg.channel})
                </div>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: msg.channel === 'Internal Note' ? '#fef3c7' : msg.senderRole === 'staff' ? 'var(--primary-accent)' : 'var(--bg-surface)',
                    color: msg.channel === 'Internal Note' ? '#92400e' : msg.senderRole === 'staff' ? '#ffffff' : 'var(--text-main)',
                    fontSize: '13px',
                    maxWidth: '80%',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendCaseChat} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Send quick update message to family via WhatsApp..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              <Send size={14} /> Send
            </button>
          </form>
        </div>
      )}

      {/* NOTES TAB */}
      {activeTab === 'notes' && (
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <form onSubmit={handlePostNote} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Add confidential director note..."
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>Post Director Note</button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {caseNotes.map(note => (
              <div key={note.id} style={{ padding: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <strong>{note.author}</strong>
                  <span>{note.date} at {note.time}</span>
                </div>
                <div style={{ marginTop: '6px', fontSize: '13px' }}>{note.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
