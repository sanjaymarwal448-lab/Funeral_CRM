import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Bot, Sparkles, Send, ShieldAlert, Cpu, ToggleLeft, ToggleRight, CheckCircle } from 'lucide-react';

export const AIAssistantView: React.FC = () => {
  const { whatsAppSettings, updateWhatsAppSettings, receiveWhatsAppMessage, chatMessages } = useCRM();

  const [simText, setSimText] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<{ id: string; msg: string; type: 'system' | 'incoming' | 'outgoing' }[]>([
    { id: '1', msg: 'System: Evergreen AI Care Assistant online. Model: GPT-4o Funeral Care Fine-Tune.', type: 'system' }
  ]);

  const handleSimulateMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simText.trim()) return;

    // Log user input
    setTerminalLogs(prev => [
      ...prev,
      { id: `in-${Date.now()}`, msg: `Incoming WhatsApp: "${simText}"`, type: 'incoming' }
    ]);

    receiveWhatsAppMessage('(206) 555-0192', simText);

    // Simulate AI reasoning logs
    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        { id: `sys-${Date.now()}`, msg: 'System: Processing message via Meta Webhook. Extracting first-call metadata...', type: 'system' },
        { id: `out-${Date.now()}`, msg: 'System: Empathetic AI response generated and dispatched via WhatsApp API.', type: 'outgoing' }
      ]);
    }, 1200);

    setSimText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px' }}>
      {/* Header */}
      <div className="card" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Eterna OS AI Assistant Console</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Monitor webhook ingress, AI reasoning chains, and grief auto-response rules</p>
        </div>

        <span style={{ fontSize: '12px', color: '#059669', backgroundColor: '#ecfdf5', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Bot size={14} /> Agent Status: Active & Responsive
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Left Column: Live Terminal Webhook Stream */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '480px', overflow: 'hidden' }}>
          <div className="card-header" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={16} /> Webhook & AI Ingress Monitor
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>POST /api/v1/whatsapp/webhook</span>
          </div>

          {/* Terminal Display */}
          <div style={{ flex: 1, padding: '20px', backgroundColor: '#0f172a', color: '#38bdf8', fontFamily: 'monospace', fontSize: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {terminalLogs.map(log => (
              <div
                key={log.id}
                style={{
                  color: log.type === 'system' ? '#94a3b8' : log.type === 'incoming' ? '#38bdf8' : '#34d399',
                  borderLeft: log.type === 'incoming' ? '3px solid #38bdf8' : log.type === 'outgoing' ? '3px solid #34d399' : '3px solid transparent',
                  paddingLeft: '8px'
                }}
              >
                {log.msg}
              </div>
            ))}
          </div>

          {/* Tester Input bar */}
          <form onSubmit={handleSimulateMessage} style={{ padding: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Simulate family message (e.g. My grandfather just passed away...)"
              value={simText}
              onChange={(e) => setSimText(e.target.value)}
              style={{ fontSize: '12px' }}
            />
            <button type="submit" className="btn btn-primary" style={{ gap: '6px' }}>
              <Send size={14} /> Send
            </button>
          </form>
        </div>

        {/* Right Column: AI Model Parameters & Rules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Settings */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--primary-accent)' }} /> Model Hyperparameters
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>AI Auto-Responder Status</span>
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => updateWhatsAppSettings({ isAutoResponderEnabled: !whatsAppSettings.isAutoResponderEnabled })}
                >
                  {whatsAppSettings.isAutoResponderEnabled ? (
                    <ToggleRight size={38} style={{ color: '#059669' }} />
                  ) : (
                    <ToggleLeft size={38} style={{ color: 'var(--text-muted)' }} />
                  )}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Auto-Create Case Files</span>
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => updateWhatsAppSettings({ autoCreateDraftCases: !whatsAppSettings.autoCreateDraftCases })}
                >
                  {whatsAppSettings.autoCreateDraftCases ? (
                    <ToggleRight size={38} style={{ color: '#059669' }} />
                  ) : (
                    <ToggleLeft size={38} style={{ color: 'var(--text-muted)' }} />
                  )}
                </button>
              </div>

              <div className="input-group">
                <label className="input-label">Select LLM Engine</label>
                <select
                  className="input-field"
                  value={whatsAppSettings.aiModel}
                  onChange={(e) => updateWhatsAppSettings({ aiModel: e.target.value as any })}
                  style={{ fontSize: '12px' }}
                >
                  <option value="GPT-4o Funeral Care">GPT-4o Funeral Care Fine-Tune</option>
                  <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Guardrails Info */}
          <div className="card" style={{ padding: '20px', border: '1px solid #fecdd3', background: '#fff5f5' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#be123c', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <ShieldAlert size={16} /> Grief-Informed Safety Guardrails
            </h3>
            <p style={{ fontSize: '12px', color: '#9f1239', lineHeight: 1.5 }}>
              The AI Agent operates under strict safety filters. Messages requesting custom pricing negotiations, legal authorizations, or immediate director dispatch are flagged automatically, disabling auto-responses and assigning a director.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
