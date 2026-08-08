import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Conversation, ChatMessage, CommunicationChannel, ConversationStatus } from '../../types/crm';
import { WhatsAppSimulator } from './WhatsAppSimulator';
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
  Sparkles,
  Zap
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
    generateAiReplyForThread,
    setDrawerItem,
    setActiveCaseId,
    setCurrentModule,
    openConfirmDialog,
    whatsAppSettings
  } = useCRM();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filters State
  const [filterChannel, setFilterChannel] = useState<string>('ALL');
  const [filterSearch, setFilterSearch] = useState<string>('');

  // Composer State
  const [composerContent, setComposerContent] = useState<string>('');
  const [selectedChannel, setSelectedChannel] = useState<CommunicationChannel>('WhatsApp');
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; url: string; size: string; type: string }[]>([]);

  // Simulator Modal State
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // Active Conversation Record
  const activeConv = useMemo(() => {
    return conversations.find(c => c.id === activeConversationId) || conversations[0];
  }, [conversations, activeConversationId]);

  // Messages for active conversation
  const activeMessages = useMemo(() => {
    if (!activeConv) return [];
    return chatMessages.filter(m => m.conversationId === activeConv.id);
  }, [chatMessages, activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

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

  const WhatsAppIcon = ({ size = 14, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" style={{ color: '#25D366', display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.705 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );

  const getChannelIcon = (ch: CommunicationChannel) => {
    switch (ch) {
      case 'WhatsApp': return <WhatsAppIcon size={14} />;
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
            <button
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '11px', color: '#059669', borderColor: '#a7f3d0' }}
              onClick={() => setIsSimulatorOpen(true)}
              title="Test WhatsApp Cloud API & AI Auto-Responder"
            >
              <Zap size={12} /> WhatsApp Simulator
            </button>
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
            {['ALL', 'WhatsApp', 'Email', 'SMS', 'Internal Note', 'Unread', 'Archived'].map(ch => {
              let icon = null;
              if (ch === 'WhatsApp') icon = <WhatsAppIcon size={12} style={{ marginRight: '4px' }} />;
              else if (ch === 'Email') icon = <Mail size={12} style={{ marginRight: '4px', color: '#2563eb' }} />;
              else if (ch === 'SMS') icon = <Phone size={12} style={{ marginRight: '4px', color: '#8b5cf6' }} />;
              else if (ch === 'Internal Note') icon = <Lock size={12} style={{ marginRight: '4px', color: '#d97706' }} />;
              else if (ch === 'Archived') icon = <Archive size={12} style={{ marginRight: '4px' }} />;

              return (
                <button
                  key={ch}
                  className={`btn btn-sm ${filterChannel === ch ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilterChannel(ch)}
                  style={{ fontSize: '11px', padding: '4px 8px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}
                >
                  {icon}
                  {ch}
                </button>
              );
            })}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--primary-accent) 0%, #5d6f56 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '16px',
                boxShadow: 'var(--shadow-sm)',
                flexShrink: 0
              }}>
                {activeConv.familyName.charAt(0)}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {activeConv.familyName}
                  </h3>
                  {whatsAppSettings.isAutoResponderEnabled && (
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#059669', backgroundColor: '#ecfdf5', padding: '2px 6px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      <Bot size={10} /> AI Agent Active
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', flexWrap: 'nowrap' }}>
                  <span style={{ whiteSpace: 'nowrap' }}>{activeConv.familyPhone}</span>
                  <span style={{ color: 'var(--border-color)' }}>|</span>
                  <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{activeConv.familyEmail}</span>
                </div>
              </div>
            </div>

            {/* Header Action Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <select
                className="input-field"
                value={activeConv.status}
                onChange={(e) => updateConversationStatus(activeConv.id, e.target.value as ConversationStatus)}
                style={{ width: '150px', fontSize: '11px', fontWeight: 600, height: '30px', padding: '0 8px' }}
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
                style={{ width: '30px', height: '30px', padding: 0 }}
                title={activeConv.isPinned ? 'Unpin Conversation' : 'Pin Conversation'}
              >
                <Pin size={14} />
              </button>

              <button
                className="btn btn-secondary btn-sm btn-icon-only"
                onClick={() => archiveConversation(activeConv.id)}
                style={{ width: '30px', height: '30px', padding: 0 }}
                title="Archive Conversation"
              >
                <Archive size={14} />
              </button>

              <button
                className="btn btn-ghost btn-sm btn-icon-only"
                style={{ color: '#e11d48', width: '30px', height: '30px', padding: 0 }}
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
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Message Stream */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-app)' }}>
            <div style={{ textAlign: 'center', margin: '8px 0' }}>
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: '999px',
                backgroundColor: 'rgba(122, 144, 115, 0.08)',
                color: 'var(--primary-accent)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                border: '1px solid rgba(122, 144, 115, 0.15)'
              }}>
                Unified History • {activeConv.preferredChannel} Cloud API Active
              </span>
            </div>

            {activeMessages.map(msg => {
              const isStaff = msg.senderRole === 'staff';
              const isAi = msg.senderRole === 'ai';
              const isInternalNote = msg.channel === 'Internal Note';

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: isInternalNote ? 'center' : (isStaff || isAi) ? 'flex-end' : 'flex-start',
                    width: '100%',
                    gap: '10px'
                  }}
                >
                  {/* Left Avatar for Incoming Family Messages */}
                  {!(isStaff || isAi || isInternalNote) && (
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '11px',
                      marginTop: '16px',
                      flexShrink: 0,
                      boxShadow: 'var(--shadow-xs)',
                      border: '1px solid var(--primary-border)'
                    }}>
                      {msg.senderName.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}

                  {/* Internal Note Card View */}
                  {isInternalNote ? (
                    <div
                      style={{
                        width: '90%',
                        backgroundColor: 'rgba(254, 243, 199, 0.55)',
                        border: '1px solid #fde68a',
                        color: '#92400e',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        fontSize: '13px',
                        boxShadow: 'var(--shadow-xs)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Lock size={12} style={{ color: '#d97706' }} /> Confidential Director Note • {msg.senderName}
                        </span>
                        <span style={{ color: '#b45309' }}>{msg.timestamp}</span>
                      </div>
                      <div style={{ color: '#78350f', fontWeight: 500, lineHeight: 1.4 }}>{msg.content}</div>
                    </div>
                  ) : (
                    /* Standard / AI Message Bubble Container */
                    <div
                      style={{
                        maxWidth: '70%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        alignItems: (isStaff || isAi) ? 'flex-end' : 'flex-start'
                      }}
                    >
                      {/* Sender Metadata */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text-muted)' }}>
                        {isAi ? <Bot size={12} style={{ color: '#059669' }} /> : getChannelIcon(msg.channel)}
                        <span style={{ fontWeight: 700 }}>{msg.senderName}</span>
                        {isAi && (
                          <span style={{ fontSize: '8px', backgroundColor: '#ecfdf5', color: '#059669', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                            🤖 AI Assistant
                          </span>
                        )}
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Bubble Text */}
                      <div
                        style={{
                          padding: '10px 14px',
                          borderRadius: (isStaff || isAi) ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          background: isAi 
                            ? 'linear-gradient(135deg, #065f46 0%, #044e39 100%)' 
                            : isStaff 
                            ? 'linear-gradient(135deg, var(--primary-accent) 0%, #63775c 100%)' 
                            : 'var(--bg-surface)',
                          color: (isStaff || isAi) ? '#ffffff' : 'var(--text-main)',
                          boxShadow: 'var(--shadow-xs)',
                          border: (isStaff || isAi) ? 'none' : '1px solid var(--border-color)',
                          fontSize: '12.5px',
                          lineHeight: 1.55
                        }}
                      >
                        {msg.content}

                        {/* Attachments Card inside bubble */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {msg.attachments.map((att, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  backgroundColor: (isStaff || isAi) ? 'rgba(255,255,255,0.15)' : 'var(--bg-subtle)',
                                  color: (isStaff || isAi) ? '#ffffff' : 'var(--text-main)',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  border: (isStaff || isAi) ? 'none' : '1px solid var(--border-color)'
                                }}
                              >
                                <Paperclip size={12} />
                                <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>{att.name}</span>
                                <span style={{ fontSize: '9px', opacity: 0.7 }}>({att.size})</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Read status icon */}
                      {(isStaff || isAi) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '9px', color: 'var(--text-subtle)' }}>
                          <CheckCheck size={11} style={{ color: '#10b981' }} /> Delivered & Read
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Composer */}
          <form onSubmit={handleSendMessage} style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Toolbar Options Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              {/* Left Selector: Send Channel */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Send Via:</span>
                <select
                  className="input-field"
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value as CommunicationChannel)}
                  style={{ width: '140px', fontSize: '11px', fontWeight: 600, height: '28px', padding: '0 6px' }}
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email</option>
                  <option value="SMS">SMS Text</option>
                  <option value="Internal Note">Internal Note</option>
                </select>
              </div>

              {/* Right Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#059669', borderColor: '#a7f3d0', fontSize: '10.5px', gap: '4px', height: '28px', padding: '0 10px' }}
                  onClick={() => generateAiReplyForThread(activeConv.id)}
                  title="Generate Empathetic AI Draft Reply"
                >
                  <Sparkles size={11} /> Generate AI Response
                </button>

                <select
                  className="input-field"
                  onChange={(e) => e.target.value && handleApplyTemplate(e.target.value)}
                  defaultValue=""
                  style={{ width: '180px', fontSize: '11px', height: '28px', padding: '0 6px' }}
                >
                  <option value="" disabled>-- Quick Templates --</option>
                  <option value="Dear family, we have received your request and updated the funeral arrangement schedule accordingly. Please let us know if you need anything else.">
                    Schedule Confirmation
                  </option>
                  <option value="Please review the attached obituary copy for publication in the newspaper. Reply with your approval to proceed.">
                    Obituary Approval request
                  </option>
                  <option value="Friendly reminder regarding invoice statement settlement for the upcoming service.">
                    Invoice Settlement reminder
                  </option>
                  <option value="Our entire staff extends our deepest condolences to your family during this difficult time.">
                    Sympathy Condolences
                  </option>
                </select>
              </div>
            </div>

            {/* Premium Textarea Composer Card */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-app)',
              padding: '10px 14px',
              gap: '8px'
            }}>
              <textarea
                placeholder={selectedChannel === 'Internal Note' ? 'Write internal director note (hidden from family)...' : `Type your ${selectedChannel} message...`}
                value={composerContent}
                onChange={(e) => setComposerContent(e.target.value)}
                rows={2}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontSize: '12.5px',
                  color: 'var(--text-main)',
                  fontFamily: 'inherit',
                  lineHeight: 1.5
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '8px' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-icon-only"
                    onClick={() => setAttachedFiles([{ name: 'Arrangement_Summary.pdf', url: '#', size: '1.4 MB', type: 'pdf' }])}
                    style={{ width: '24px', height: '24px', padding: 0 }}
                    title="Attach File"
                  >
                    <Paperclip size={14} style={{ color: 'var(--text-muted)' }} />
                  </button>
                  {attachedFiles.map((file, idx) => (
                    <span 
                      key={idx} 
                      style={{ 
                        fontSize: '9px', 
                        backgroundColor: 'var(--primary-light)', 
                        color: 'var(--primary-accent)', 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        fontWeight: 600,
                        border: '1px solid var(--primary-border)'
                      }}
                    >
                      {file.name}
                      <span 
                        style={{ cursor: 'pointer', fontWeight: 800, marginLeft: '4px' }} 
                        onClick={() => setAttachedFiles([])}
                        title="Remove"
                      >
                        ×
                      </span>
                    </span>
                  ))}
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm" 
                  style={{ 
                    padding: '4px 16px', 
                    fontSize: '11px',
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    borderRadius: '6px',
                    boxShadow: 'var(--shadow-xs)' 
                  }}
                >
                  <Send size={11} /> Send
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
              <span style={{ color: 'var(--text-muted)' }}>AI Auto-Responder:</span>
              <strong style={{ color: '#059669' }}>Enabled</strong>
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

      <WhatsAppSimulator
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />
    </div>
  );
};
