import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { MessageSquare, Send, Bot, Zap, CheckCircle2, X } from 'lucide-react';

interface WhatsAppSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({ isOpen, onClose }) => {
  const { receiveWhatsAppMessage, whatsAppSettings } = useCRM();

  const [phone, setPhone] = useState('(206) 555-0192');
  const [customMsg, setCustomMsg] = useState('');
  const [logs, setLogs] = useState<{ id: string; time: string; type: 'webhook' | 'ai'; text: string }[]>([]);

  if (!isOpen) return null;

  const handleSimulate = (text: string) => {
    if (!text.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Log Webhook Ingress
    const newLog = {
      id: `log-${Date.now()}`,
      time: timestamp,
      type: 'webhook' as const,
      text: `[POST /api/v1/whatsapp/webhook] Received message from ${phone}: "${text}"`
    };
    setLogs(prev => [newLog, ...prev]);

    // Dispatch to CRM State & AI Assistant Engine
    receiveWhatsAppMessage(phone, text);

    // Log AI Processing
    setTimeout(() => {
      setLogs(prev => [
        {
          id: `log-ai-${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          type: 'ai',
          text: `[AI Agent Response Engine - ${whatsAppSettings.aiModel}] Message processed -> Empathetic AI response & structured CRM actions executed.`
        },
        ...prev
      ]);
    }, 1100);

    setCustomMsg('');
  };

  const presets = [
    {
      title: '🚨 First Call & Emergency Intake',
      text: 'Hi, my mother Eleanor passed away at St. Jude Hospital. We need help with funeral arrangements.'
    },
    {
      title: '💰 Package & Pricing Inquiry',
      text: 'What is included in your Direct Cremation package and what does it cost?'
    },
    {
      title: '👤 Request Human Director Handover',
      text: 'I would like to speak with Senior Director Marcus Vance directly.'
    },
    {
      title: '📰 Obituary Approval',
      text: 'We have reviewed the draft obituary for Eleanor Sterling and approve it for newspaper release.'
    }
  ];

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '620px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#064e3b', color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={20} />
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>WhatsApp Business Cloud API Simulator</h3>
              <div style={{ fontSize: '11px', opacity: 0.85 }}>Meta Cloud API Webhook & AI Assistant Real-Time Tester</div>
            </div>
          </div>

          <button className="btn btn-ghost btn-sm btn-icon-only" style={{ color: '#ffffff' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Preset Buttons */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
              Quick Scenario Presets:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  className="btn btn-secondary"
                  style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px', padding: '10px', fontSize: '11px', height: 'auto' }}
                  onClick={() => handleSimulate(p.text)}
                >
                  <strong style={{ color: 'var(--primary-accent)' }}>{p.title}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>"{p.text}"</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message Input */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
              <div>
                <label className="input-label">Sender Phone #</label>
                <input
                  type="text"
                  className="input-field"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ fontSize: '12px' }}
                />
              </div>
              <div>
                <label className="input-label">Incoming WhatsApp Message Text</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Can we change the funeral time to 2 PM?"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSimulate(customMsg)}
                  style={{ fontSize: '12px' }}
                />
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ backgroundColor: '#059669', alignSelf: 'flex-end', gap: '6px' }}
              onClick={() => handleSimulate(customMsg)}
            >
              <Send size={14} /> Send WhatsApp Cloud Webhook Payload
            </button>
          </div>

          {/* Webhook Activity Stream */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
                Live Webhook Logs ({logs.length})
              </span>
              <span style={{ fontSize: '10px', color: '#059669', fontWeight: 700 }}>● Meta API Status: 200 OK</span>
            </div>

            <div style={{ backgroundColor: '#0f172a', color: '#38bdf8', padding: '12px', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', fontSize: '11px', maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {logs.length === 0 ? (
                <div style={{ opacity: 0.6 }}>No Webhook payloads received yet. Click a preset above to test!</div>
              ) : (
                logs.map(log => (
                  <div key={log.id} style={{ color: log.type === 'ai' ? '#34d399' : '#38bdf8' }}>
                    [{log.time}] {log.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
