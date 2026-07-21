import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Building2, Palette, ShieldCheck, Mail, Phone, Globe, MessageSquare, Bot, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, whatsAppSettings, updateWhatsAppSettings } = useCRM();

  // Settings form states
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [taxId, setTaxId] = useState(settings.taxId);
  const [taxRate, setTaxRate] = useState(settings.taxRate);

  // WhatsApp & AI states
  const [metaAppId, setMetaAppId] = useState(whatsAppSettings.metaAppId);
  const [phoneNumberId, setPhoneNumberId] = useState(whatsAppSettings.phoneNumberId);
  const [accessToken, setAccessToken] = useState(whatsAppSettings.accessToken);
  const [webhookSecret, setWebhookSecret] = useState(whatsAppSettings.webhookSecret);
  const [isAutoResponderEnabled, setIsAutoResponderEnabled] = useState(whatsAppSettings.isAutoResponderEnabled);
  const [aiModel, setAiModel] = useState(whatsAppSettings.aiModel);
  const [aiTone, setAiTone] = useState(whatsAppSettings.aiTone);
  const [autoCreateDraftCases, setAutoCreateDraftCases] = useState(whatsAppSettings.autoCreateDraftCases);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      companyName,
      tagline,
      address,
      phone,
      email,
      taxId,
      taxRate: Number(taxRate)
    });
  };

  const handleSaveWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    updateWhatsAppSettings({
      metaAppId,
      phoneNumberId,
      accessToken,
      webhookSecret,
      isAutoResponderEnabled,
      aiModel,
      aiTone,
      autoCreateDraftCases
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px' }}>
      {/* Header */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800 }}>System & API Configuration</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Manage funeral director branding, WhatsApp Business Cloud API & AI Auto-Responder integrations</p>
      </div>

      {/* WHATSAPP BUSINESS API & AI ASSISTANT SETTINGS */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
          <MessageSquare size={22} style={{ color: '#059669' }} />
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>WhatsApp Business Cloud API & AI Care Assistant</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Configure Meta Cloud API webhooks & AI grief support auto-responder</p>
          </div>
        </div>

        <form onSubmit={handleSaveWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Meta App ID</label>
              <input
                type="text"
                className="input-field"
                value={metaAppId}
                onChange={(e) => setMetaAppId(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">WhatsApp Phone Number ID</label>
              <input
                type="text"
                className="input-field"
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Permanent Meta Graph API Access Token</label>
            <input
              type="password"
              className="input-field"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Webhook Secret Verification Token</label>
            <input
              type="text"
              className="input-field"
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
            />
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>AI Auto-Responder Settings</h4>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="checkbox"
                id="aiToggle"
                checked={isAutoResponderEnabled}
                onChange={(e) => setIsAutoResponderEnabled(e.target.checked)}
              />
              <label htmlFor="aiToggle" style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Enable AI Funeral Assistant Auto-Responder for WhatsApp Messages
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="checkbox"
                id="autoCaseToggle"
                checked={autoCreateDraftCases}
                onChange={(e) => setAutoCreateDraftCases(e.target.checked)}
              />
              <label htmlFor="autoCaseToggle" style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Automatically Create Draft Funeral Cases from WhatsApp Emergency First Calls
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '6px' }}>
              <div className="input-group">
                <label className="input-label">AI Assistant Model</label>
                <select className="input-field" value={aiModel} onChange={(e) => setAiModel(e.target.value as any)}>
                  <option value="GPT-4o Funeral Care">GPT-4o Funeral Care Fine-Tune</option>
                  <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Communication Tone</label>
                <select className="input-field" value={aiTone} onChange={(e) => setAiTone(e.target.value as any)}>
                  <option value="Empathetic & Dignified">Empathetic & Dignified</option>
                  <option value="Formal & Professional">Formal & Professional</option>
                  <option value="Warm & Supportive">Warm & Supportive</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
            <Save size={16} /> Save WhatsApp & AI Settings
          </button>
        </form>
      </div>

      {/* COMPANY BRANDING SETTINGS */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
          <Building2 size={22} style={{ color: 'var(--primary-accent)' }} />
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Company Details & Receipt Branding</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Primary information displayed on contracts and client statements</p>
          </div>
        </div>

        <form onSubmit={handleSaveCompany} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Funeral Home Name</label>
              <input type="text" className="input-field" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>

            <div className="input-group">
              <label className="input-label">Tagline / Motto</label>
              <input type="text" className="input-field" value={tagline} onChange={(e) => setTagline(e.target.value)} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Physical Address</label>
            <input type="text" className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <input type="text" className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="input-group">
              <label className="input-label">Public Email</label>
              <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Tax ID Number</label>
              <input type="text" className="input-field" value={taxId} onChange={(e) => setTaxId(e.target.value)} />
            </div>

            <div className="input-group">
              <label className="input-label">Tax Rate (%)</label>
              <input type="number" step="0.1" className="input-field" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
            <Save size={16} /> Save Company Settings
          </button>
        </form>
      </div>
    </div>
  );
};
