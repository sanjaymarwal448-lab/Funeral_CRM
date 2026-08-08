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
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 700, color: 'var(--text-main)' }}>
            Eterna OS AI Assistant Console
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Monitor webhook ingress, AI reasoning chains, and grief auto-response rules
          </p>
        </div>

        <span style={{ fontSize: '11px', color: '#059669', backgroundColor: '#ecfdf5', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #a7f3d0' }}>
          <Bot size={14} /> Agent Status: Active & Responsive
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
        {/* Left Column: Live Terminal Webhook Stream with macOS window bar styling */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '520px', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', backgroundColor: 'var(--bg-surface)' }}>
          {/* macOS window title bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', backgroundColor: '#181b1f', borderBottom: '1px solid #2e353f' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
            </div>
            <span style={{ fontSize: '10.5px', color: '#94a3b8', fontFamily: 'monospace', fontWeight: 600 }}>
              POST /api/v1/whatsapp/webhook
            </span>
          </div>

          {/* Terminal Display */}
          <div style={{ flex: 1, padding: '20px', backgroundColor: '#1e242b', color: '#38bdf8', fontFamily: 'monospace', fontSize: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {terminalLogs.map(log => (
              <div
                key={log.id}
                style={{
                  color: log.type === 'system' ? '#94a3b8' : log.type === 'incoming' ? '#38bdf8' : '#34d399',
                  borderLeft: log.type === 'incoming' ? '3px solid #38bdf8' : log.type === 'outgoing' ? '3px solid #34d399' : '3px solid transparent',
                  paddingLeft: '10px',
                  lineHeight: 1.4
                }}
              >
                {log.msg}
              </div>
            ))}
          </div>

          {/* Tester Input bar */}
          <form onSubmit={handleSimulateMessage} style={{ padding: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px', backgroundColor: 'var(--bg-subtle)' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Simulate family message (e.g. My grandfather just passed away...)"
              value={simText}
              onChange={(e) => setSimText(e.target.value)}
              style={{ fontSize: '12.5px', flex: 1 }}
            />
            <button type="submit" className="btn btn-primary" style={{ gap: '6px', padding: '0 18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={13} /> Simulate
            </button>
          </form>
        </div>

        {/* Right Column: AI Model Parameters & Rules (The Sidebar) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Settings */}
          <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--primary-accent)' }} /> Model Parameters
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-main)' }}>AI Auto-Responder</span>
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() => updateWhatsAppSettings({ isAutoResponderEnabled: !whatsAppSettings.isAutoResponderEnabled })}
                >
                  {whatsAppSettings.isAutoResponderEnabled ? (
                    <ToggleRight size={36} style={{ color: 'var(--primary-accent)' }} />
                  ) : (
                    <ToggleLeft size={36} style={{ color: 'var(--text-subtle)' }} />
                  )}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-main)' }}>Auto-Create Cases</span>
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() => updateWhatsAppSettings({ autoCreateDraftCases: !whatsAppSettings.autoCreateDraftCases })}
                >
                  {whatsAppSettings.autoCreateDraftCases ? (
                    <ToggleRight size={36} style={{ color: 'var(--primary-accent)' }} />
                  ) : (
                    <ToggleLeft size={36} style={{ color: 'var(--text-subtle)' }} />
                  )}
                </button>
              </div>

              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                  Select LLM Engine
                </label>
                <select
                  className="input-field"
                  value={whatsAppSettings.aiModel}
                  onChange={(e) => updateWhatsAppSettings({ aiModel: e.target.value as any })}
                  style={{ fontSize: '12px', height: '32px', padding: '0 8px' }}
                >
                  <option value="GPT-4o Funeral Care">GPT-4o Funeral Care Fine-Tune</option>
                  <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Guardrails Info: Gold-themed Elegant Container */}
          <div className="card" style={{ padding: '20px', border: '1px solid rgba(197, 179, 130, 0.25)', background: 'rgba(197, 179, 130, 0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#a08d5b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={15} /> Grief-Informed Safety
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              The AI Agent operates under strict safety filters. The following topics trigger immediate human handover:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', fontWeight: 600, color: 'var(--text-main)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={12} style={{ color: 'var(--primary-accent)' }} /> Price Negotiations
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={12} style={{ color: 'var(--primary-accent)' }} /> Legal Authorizations
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={12} style={{ color: 'var(--primary-accent)' }} /> Immediate Dispatch
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
