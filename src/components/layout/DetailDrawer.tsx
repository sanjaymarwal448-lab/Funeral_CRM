import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { X, Phone, Mail, MapPin, Calendar, FileText, ExternalLink, MessageSquare, Send } from 'lucide-react';

export const DetailDrawer: React.FC = () => {
  const {
    drawerItem,
    setDrawerItem,
    cases,
    families,
    invoices,
    vehicles,
    staff,
    conversations,
    chatMessages,
    sendChatMessage,
    setActiveCaseId,
    setCurrentModule
  } = useCRM();

  const [activeDrawerTab, setActiveDrawerTab] = useState<'details' | 'conversations'>('details');
  const [drawerChatInput, setDrawerChatInput] = useState('');

  if (!drawerItem) return null;

  const familyData = drawerItem.type === 'family' ? families.find(f => f.id === drawerItem.id) : null;
  const caseData = drawerItem.type === 'case' ? cases.find(c => c.id === drawerItem.id) : null;
  const invoiceData = drawerItem.type === 'invoice' ? invoices.find(i => i.id === drawerItem.id) : null;
  const vehicleData = drawerItem.type === 'vehicle' ? vehicles.find(v => v.id === drawerItem.id) : null;
  const staffData = drawerItem.type === 'staff' ? staff.find(s => s.id === drawerItem.id) : null;

  // Family linked conversation
  const familyConv = familyData ? conversations.find(c => c.familyId === familyData.id) || conversations[0] : null;
  const familyMessages = familyConv ? chatMessages.filter(m => m.conversationId === familyConv.id) : [];

  const handleSendDrawerChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drawerChatInput.trim() || !familyConv) return;
    sendChatMessage(familyConv.id, drawerChatInput, familyConv.preferredChannel);
    setDrawerChatInput('');
  };

  return (
    <div className="drawer-overlay" onClick={() => setDrawerItem(null)}>
      <div className="drawer-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-accent)' }}>
              {drawerItem.type} Details
            </span>
            <h2 style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px', color: 'var(--text-main)' }}>
              {familyData?.name || caseData?.deceasedName || invoiceData?.invoiceNumber || vehicleData?.name || staffData?.name}
            </h2>
          </div>
          <button className="btn btn-ghost btn-sm btn-icon-only" onClick={() => setDrawerItem(null)}>
            <X size={18} />
          </button>
        </div>

        {/* Family Drawer Tabs */}
        {drawerItem.type === 'family' && (
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', padding: '0 20px' }}>
            <button
              onClick={() => setActiveDrawerTab('details')}
              style={{
                padding: '10px 14px',
                fontWeight: 600,
                fontSize: '12px',
                border: 'none',
                backgroundColor: 'transparent',
                color: activeDrawerTab === 'details' ? 'var(--primary-accent)' : 'var(--text-muted)',
                borderBottom: activeDrawerTab === 'details' ? '2px solid var(--primary-accent)' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              Profile Details
            </button>
            <button
              onClick={() => setActiveDrawerTab('conversations')}
              style={{
                padding: '10px 14px',
                fontWeight: 600,
                fontSize: '12px',
                border: 'none',
                backgroundColor: 'transparent',
                color: activeDrawerTab === 'conversations' ? 'var(--primary-accent)' : 'var(--text-muted)',
                borderBottom: activeDrawerTab === 'conversations' ? '2px solid var(--primary-accent)' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              Conversations ({familyMessages.length})
            </button>
          </div>
        )}

        {/* Drawer Body */}
        <div className="drawer-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* FAMILY PROFILE */}
          {familyData && activeDrawerTab === 'details' && (
            <>
              <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={14} style={{ color: 'var(--text-subtle)' }} />
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{familyData.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={14} style={{ color: 'var(--text-subtle)' }} />
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{familyData.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} style={{ color: 'var(--text-subtle)' }} />
                  <span style={{ fontSize: '13px' }}>{familyData.address}</span>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '10px' }}>
                  Linked Deceased Cases
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {familyData.linkedCases.map(lc => (
                    <div
                      key={lc.caseId}
                      className="card"
                      style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => {
                        setDrawerItem(null);
                        setActiveCaseId(lc.caseId);
                        setCurrentModule('Cases');
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--primary-accent)' }}>{lc.deceasedName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Case #{lc.caseNumber}</div>
                      </div>
                      <ExternalLink size={14} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* FAMILY CONVERSATIONS TAB */}
          {familyData && activeDrawerTab === 'conversations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <span>Preferred Channel: <strong>{familyConv?.preferredChannel || 'WhatsApp'}</strong></span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setDrawerItem(null);
                    setCurrentModule('Conversations');
                  }}
                >
                  Open Full Inbox <ExternalLink size={12} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto', backgroundColor: 'var(--bg-app)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                {familyMessages.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.senderRole === 'staff' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                      {msg.senderName} • {msg.timestamp}
                    </div>
                    <div
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: msg.senderRole === 'staff' ? 'var(--primary-accent)' : 'var(--bg-surface)',
                        color: msg.senderRole === 'staff' ? '#ffffff' : 'var(--text-main)',
                        fontSize: '12px',
                        maxWidth: '85%'
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendDrawerChat} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Send quick reply..."
                  value={drawerChatInput}
                  onChange={(e) => setDrawerChatInput(e.target.value)}
                  style={{ fontSize: '12px' }}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
