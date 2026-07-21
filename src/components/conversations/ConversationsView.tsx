import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Conversation, ChatMessage, CommunicationChannel, ConversationStatus } from '../../types/crm';
import {
  Search,
  MessageSquare,
  Mail,
  Phone,
  Lock,
  Bot,
  Globe,
  Pin,
  Archive,
  Trash2,
  Paperclip,
  Send,
  User,
  Calendar,
  ExternalLink,
  CheckCheck,
  Check,
  Plus,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

export const ConversationsView: React.FC = () => {
  const {
    conversations,
    chatMessages,
    activeConversationId,
    setActiveConversationId,
    sendChatMessage,
    updateConversationStatus,
    togglePinConversation,
    archiveConversation,
    deleteConversation,
    assignConversationStaff,
    setDrawerItem,
    setActiveCaseId,
    setCurrentModule,
    openConfirmDialog,
    cases,
    staff
  } = useCRM();

  // Filters State
  const [filterChannel, setFilterChannel] = useState<string>('ALL');
  const [filterSearch, setFilterSearch] = useState<string>('');

  // Composer State
  const [composerContent, setComposerContent] = useState<string>('');
  const [selectedChannel, setSelectedChannel] = useState<CommunicationChannel>('WhatsApp');
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; url: string; size: string; type: string }[]>([]);

  // Active Conversation Record
  const activeConv = useMemo(() => {
    return conversations.find(c => c.id === activeConversationId) || conversations[0];
  }, [conversations, activeConversationId]);

  // Messages for active conversation
  const activeMessages = useMemo(() => {
    if (!activeConv) return [];
    return chatMessages.filter(m => m.conversationId === activeConv.id);
  }, [chatMessages, activeConv]);

  // Filtered Conversations List
  const filteredConversations = useMemo(() => {
    return conversations.filter(c => {
      const term = filterSearch.toLowerCase();
      const matchesSearch =
        c.familyName.toLowerCase().includes(term) ||
        c.familyPhone.includes(term) ||
        c.familyEmail.toLowerCase().includes(term) ||
        (c.caseNumber && c.caseNumber.toLowerCase().includes(term)) ||
        c.lastMessage.toLowerCase().includes(term);

      const matchesChannel =
        filterChannel === 'ALL' ||
        (filterChannel === 'Archived' && c.status === 'Archived') ||
        (filterChannel === 'Unread' && c.unreadCount > 0) ||
        c.preferredChannel === filterChannel;

      return matchesSearch && matchesChannel;
    });
  }, [conversations, filterSearch, filterChannel]);

  // Shared Attachments for Active Conversation
  const sharedAttachments = useMemo(() => {
    const list: { name: string; size: string; type: string }[] = [];
    activeMessages.forEach(m => {
      if (m.attachments) {
        m.attachments.forEach(att => list.push(att));
      }
    });
    return list;
  }, [activeMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerContent.trim() && attachedFiles.length === 0) return;
    if (!activeConv) return;

    sendChatMessage(
      activeConv.id,
      composerContent,
      selectedChannel,
      attachedFiles.length > 0 ? attachedFiles : undefined
    );

    setComposerContent('');
    setAttachedFiles([]);
  };

  const handleApplyTemplate = (templateText: string) => {
    setComposerContent(templateText);
  };

  const getChannelIcon = (ch: CommunicationChannel) => {
    switch (ch) {
      case 'WhatsApp': return <MessageSquare size={14} style={{ color: '#10b981' }} />;
      case 'Email': return <Mail size={14} style={{ color: '#2563eb' }} />;
      case 'SMS': return <Phone size={14} style={{ color: '#8b5cf6' }} />;
      case 'Internal Note': return <Lock size={14} style={{ color: '#d97706' }} />;
      case 'AI Voice Transcript': return <Bot size={14} style={{ color: '#ec4899' }} />;
      case 'Website Chat': return <Globe size={14} style={{ color: '#06b6d4' }} />;
      default: return <MessageSquare size={14} />;
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr 320px',
        gap: '20px',
        height: 'calc(100vh - 128px)',
        minHeight: '600px'
      }}
    >
      {/* ================= LEFT PANEL: CONVERSATIONS LIST ================= */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Panel Header & Search */}
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Inbox Conversations</h3>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-accent)' }}>
              {conversations.filter(c => c.unreadCount > 0).length} Unread
            </span>
          </div>

          <div className="search-input-wrapper">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              className="input-field"
              placeholder="Search conversations, case #..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              style={{ paddingLeft: '32px', fontSize: '12px' }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
            {['ALL', 'WhatsApp', 'Email', 'SMS', 'Internal Note', 'Unread', 'Archived'].map(ch => (
              <button
                key={ch}
                className={`btn btn-sm ${filterChannel === ch ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterChannel(ch)}
                style={{ fontSize: '11px', padding: '4px 8px', whiteSpace: 'nowrap' }}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {filteredConversations.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
              No conversations found.
            </div>
          ) : (
            filteredConversations.map(conv => {
              const isActive = conv.id === activeConv?.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--border-light)',
                    backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    borderLeft: isActive ? '4px solid var(--primary-accent)' : '4px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary-accent)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '12px',
                          flexShrink: 0
                        }}
                      >
                        {conv.familyName.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {conv.familyName}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {conv.isPinned && <Pin size={12} style={{ color: 'var(--primary-accent)' }} />}
                      <span style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>{conv.lastMessageTime}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {getChannelIcon(conv.preferredChannel)}
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {conv.lastMessage}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span style={{ backgroundColor: '#ef4444', color: '#ffffff', fontSize: '10px', fontWeight: 800, borderRadius: '999px', padding: '1px 6px' }}>
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                    {conv.caseNumber ? (
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--primary-accent)' }}>
                        Case #{conv.caseNumber}
                      </span>
                    ) : (
                      <span style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>General Contact</span>
                    )}

                    <span className={`badge badge-${conv.status === 'Open' ? 'active' : conv.status === 'Waiting for Family' ? 'transit' : 'completed'}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                      {conv.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ================= CENTER PANEL: CONVERSATION THREAD ================= */}
      {activeConv ? (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Thread Header */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-accent)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '15px' }}>
                {activeConv.familyName.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                  {activeConv.familyName}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>{activeConv.familyPhone}</span>
                  <span>•</span>
                  <span>{activeConv.familyEmail}</span>
                </div>
              </div>
            </div>

            {/* Header Action Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <select
                className="input-field"
                value={activeConv.status}
                onChange={(e) => updateConversationStatus(activeConv.id, e.target.value as ConversationStatus)}
                style={{ width: '160px', fontSize: '12px', fontWeight: 600 }}
              >
                <option value="Open">Status: Open</option>
                <option value="Waiting for Family">Waiting for Family</option>
                <option value="Waiting for Staff">Waiting for Staff</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
                <option value="Archived">Archived</option>
              </select>

              <button
                className={`btn btn-secondary btn-sm btn-icon-only ${activeConv.isPinned ? 'btn-primary' : ''}`}
                onClick={() => togglePinConversation(activeConv.id)}
                title={activeConv.isPinned ? 'Unpin Conversation' : 'Pin Conversation'}
              >
                <Pin size={16} />
              </button>

              <button
                className="btn btn-secondary btn-sm btn-icon-only"
                onClick={() => archiveConversation(activeConv.id)}
                title="Archive Conversation"
              >
                <Archive size={16} />
              </button>

              <button
                className="btn btn-ghost btn-sm btn-icon-only"
                style={{ color: '#e11d48' }}
                onClick={() => {
                  openConfirmDialog({
                    title: `Delete Conversation with ${activeConv.familyName}?`,
                    message: 'Are you sure you want to delete this message thread permanently?',
                    confirmText: 'Delete Thread',
                    variant: 'danger',
                    onConfirm: () => deleteConversation(activeConv.id)
                  });
                }}
                title="Delete Thread"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Message Stream */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-app)' }}>
            <div style={{ textAlign: 'center', margin: '8px 0' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
                Unified Chronological History • {activeConv.preferredChannel} Connected
              </span>
            </div>

            {activeMessages.map(msg => {
              const isStaff = msg.senderRole === 'staff';
              const isInternalNote = msg.channel === 'Internal Note';

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isInternalNote ? 'center' : isStaff ? 'flex-end' : 'flex-start',
                    width: '100%'
                  }}
                >
                  {/* Internal Note Banner View */}
                  {isInternalNote ? (
                    <div
                      style={{
                        width: '90%',
                        backgroundColor: '#fef3c7',
                        border: '1px solid #fde68a',
                        color: '#92400e',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 16px',
                        fontSize: '13px',
                        boxShadow: 'var(--shadow-xs)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: 700 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Lock size={12} /> Confidential Internal Director Note • {msg.senderName}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div style={{ color: '#78350f', fontWeight: 500 }}>{msg.content}</div>
                    </div>
                  ) : (
                    /* Standard Message Bubble */
                    <div
                      style={{
                        maxWidth: '75%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        alignItems: isStaff ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                        {getChannelIcon(msg.channel)}
                        <span style={{ fontWeight: 600 }}>{msg.senderName}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        style={{
                          padding: '12px 16px',
                          borderRadius: isStaff ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                          backgroundColor: isStaff ? 'var(--primary-accent)' : 'var(--bg-surface)',
                          color: isStaff ? '#ffffff' : 'var(--text-main)',
                          boxShadow: 'var(--shadow-xs)',
                          border: isStaff ? 'none' : '1px solid var(--border-color)',
                          fontSize: '13px',
                          lineHeight: 1.5
                        }}
                      >
                        {msg.content}

                        {/* Attachments Card */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {msg.attachments.map((att, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '8px 12px',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: isStaff ? 'rgba(255,255,255,0.15)' : 'var(--bg-subtle)',
                                  color: isStaff ? '#ffffff' : 'var(--text-main)',
                                  fontSize: '12px',
                                  fontWeight: 600
                                }}
                              >
                                <Paperclip size={14} />
                                <span>{att.name} ({att.size})</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {isStaff && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-subtle)' }}>
                          <CheckCheck size={12} style={{ color: '#10b981' }} /> Delivered & Read
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Message Composer */}
          <form onSubmit={handleSendMessage} style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Toolbar: Channel selector + Templates */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Send Via:</span>
                <select
                  className="input-field"
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value as CommunicationChannel)}
                  style={{ width: '160px', fontSize: '12px', fontWeight: 600 }}
                >
                  <option value="WhatsApp">WhatsApp Message</option>
                  <option value="Email">Email Response</option>
                  <option value="SMS">SMS Text</option>
                  <option value="Internal Note">Internal Note</option>
                </select>
              </div>

              {/* Quick Response Templates */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} style={{ color: 'var(--primary-accent)' }} />
                <select
                  className="input-field"
                  onChange={(e) => e.target.value && handleApplyTemplate(e.target.value)}
                  defaultValue=""
                  style={{ width: '210px', fontSize: '12px' }}
                >
                  <option value="" disabled>-- Quick Reply Template --</option>
                  <option value="Dear family, we have received your request and updated the funeral arrangement schedule accordingly. Please let us know if you need anything else.">
                    Arrangement Schedule Confirmation
                  </option>
                  <option value="Please review the attached obituary copy for publication in the newspaper. Reply with your approval to proceed.">
                    Obituary Draft Approval
                  </option>
                  <option value="Friendly reminder regarding invoice statement settlement for the upcoming service.">
                    Invoice Settlement Reminder
                  </option>
                  <option value="Our entire staff extends our deepest condolences to your family during this difficult time.">
                    Sympathy & Condolence Note
                  </option>
                </select>
              </div>
            </div>

            {/* Input & Send Area */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
              <textarea
                className="input-field"
                rows={2}
                placeholder={selectedChannel === 'Internal Note' ? 'Write internal director note (hidden from family)...' : `Type your ${selectedChannel} message...`}
                value={composerContent}
                onChange={(e) => setComposerContent(e.target.value)}
                style={{ flex: 1, resize: 'none' }}
              />

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-icon-only"
                  onClick={() => setAttachedFiles([{ name: 'Arrangement_Summary.pdf', url: '#', size: '1.4 MB', type: 'pdf' }])}
                  title="Attach File"
                >
                  <Paperclip size={18} />
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px' }}>
                  <Send size={16} /> Send
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
          Select a conversation from the left inbox.
        </div>
      )}

      {/* ================= RIGHT PANEL: CONVERSATION DETAILS ================= */}
      {activeConv ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          {/* Family Contact Card */}
          <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--primary-accent)', fontWeight: 700 }}>
              Family Information
            </h4>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>{activeConv.familyName}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{activeConv.familyPhone}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{activeConv.familyEmail}</div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setDrawerItem({ type: 'family', id: activeConv.familyId })}
            >
              Open Family Profile <ExternalLink size={12} />
            </button>
          </div>

          {/* Linked Case Card */}
          {activeConv.caseId && (
            <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--primary-accent)', fontWeight: 700 }}>
                Linked Case File
              </h4>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>{activeConv.deceasedName}</div>
                <div style={{ fontSize: '12px', color: 'var(--primary-accent)', fontWeight: 600 }}>Case #{activeConv.caseNumber}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Director: {activeConv.assignedStaffName}</div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setActiveCaseId(activeConv.caseId!);
                  setCurrentModule('Cases');
                }}
              >
                Open Full Case File <ExternalLink size={12} />
              </button>
            </div>
          )}

          {/* Quick Communication Stats */}
          <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Communication Stats
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Preferred Channel:</span>
              <strong style={{ color: 'var(--primary-accent)' }}>{activeConv.preferredChannel}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Messages:</span>
              <strong>{activeMessages.length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Last Response:</span>
              <span>{activeConv.lastMessageTime}</span>
            </div>
          </div>

          {/* Shared Files Grid */}
          <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Shared Files ({sharedAttachments.length})
            </h4>

            {sharedAttachments.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>No files shared yet.</div>
            ) : (
              sharedAttachments.map((att, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-subtle)' }}>
                  <FileText size={16} style={{ color: 'var(--primary-accent)' }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{att.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{att.size}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
