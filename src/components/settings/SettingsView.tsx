import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Building2, Palette, ShieldCheck, Mail, Phone, Globe, MessageSquare, Bot, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    whatsAppSettings, 
    updateWhatsAppSettings,
    emailSettings,
    updateEmailSettings,
    smsSettings,
    updateSmsSettings
  } = useCRM();

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

  // Email states
  const [emailProvider, setEmailProvider] = useState(emailSettings.provider);
  const [emailjsServiceId, setEmailjsServiceId] = useState(emailSettings.emailjsServiceId);
  const [emailjsTemplateId, setEmailjsTemplateId] = useState(emailSettings.emailjsTemplateId);
  const [emailjsPublicKey, setEmailjsPublicKey] = useState(emailSettings.emailjsPublicKey);
  const [senderEmail, setSenderEmail] = useState(emailSettings.senderEmail);

  // SMS states
  const [smsProvider, setSmsProvider] = useState(smsSettings.provider);
  const [twilioAccountSid, setTwilioAccountSid] = useState(smsSettings.twilioAccountSid);
  const [twilioAuthToken, setTwilioAuthToken] = useState(smsSettings.twilioAuthToken);
  const [twilioPhoneNumber, setTwilioPhoneNumber] = useState(smsSettings.twilioPhoneNumber);

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

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmailSettings({
      provider: emailProvider,
      emailjsServiceId,
      emailjsTemplateId,
      emailjsPublicKey,
      senderEmail
    });
  };

  const handleSaveSms = (e: React.FormEvent) => {
    e.preventDefault();
    updateSmsSettings({
      provider: smsProvider,
      twilioAccountSid,
      twilioAuthToken,
      twilioPhoneNumber
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

      {/* EMAIL GATEWAY CONNECTION */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
          <Mail size={22} style={{ color: '#2563eb' }} />
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Email Gateway Connection (EmailJS / SMTP)</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Configure automated client notifications and obituary approval emails</p>
          </div>
        </div>

        <form onSubmit={handleSaveEmail} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Email Service Provider</label>
              <select className="input-field" value={emailProvider} onChange={(e) => setEmailProvider(e.target.value as any)}>
                <option value="EmailJS">EmailJS Cloud API (Client-Side Send)</option>
                <option value="SMTP">Direct SMTP Server (Requires Backend)</option>
                <option value="SendGrid">SendGrid Web API</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Sender Email Address</label>
              <input type="email" className="input-field" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} />
            </div>
          </div>

          {emailProvider === 'EmailJS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: 'var(--bg-app)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>EmailJS Credentials</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">Service ID</label>
                  <input type="text" className="input-field" value={emailjsServiceId} onChange={(e) => setEmailjsServiceId(e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Template ID</label>
                  <input type="text" className="input-field" value={emailjsTemplateId} onChange={(e) => setEmailjsTemplateId(e.target.value)} />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Public Key / User ID</label>
                <input type="text" className="input-field" value={emailjsPublicKey} onChange={(e) => setEmailjsPublicKey(e.target.value)} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Save size={16} /> Save Email Settings
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                if (emailjsServiceId === 'service_evg2026') {
                  alert('Please enter your own live EmailJS keys first to test the connection.');
                  return;
                }
                fetch('https://api.emailjs.com/api/v1.0/email/send', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    service_id: emailjsServiceId,
                    template_id: emailjsTemplateId,
                    user_id: emailjsPublicKey,
                    template_params: {
                      to_email: senderEmail,
                      to_name: 'Test Client',
                      message: 'Test message from Eterna OS connection diagnostic.',
                      subject: 'Eterna OS Email Verification Test'
                    }
                  })
                })
                .then(res => {
                  if (res.ok) alert('Connection Test Successful! A verification email was sent to ' + senderEmail);
                  else res.text().then(err => alert('Connection Test Failed: ' + err));
                })
                .catch(err => alert('Network Connection Test Failed: ' + err));
              }}
            >
              Test Email Connection
            </button>
          </div>
        </form>
      </div>

      {/* SMS GATEWAY CONNECTION */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
          <Phone size={22} style={{ color: '#ea580c' }} />
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>SMS Gateway Connection (Twilio)</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Configure Twilio SMS messaging to send status updates directly to family mobile numbers</p>
          </div>
        </div>

        <form onSubmit={handleSaveSms} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">SMS Provider</label>
              <select className="input-field" value={smsProvider} onChange={(e) => setSmsProvider(e.target.value as any)}>
                <option value="Twilio">Twilio API Gateway</option>
                <option value="Vonage">Vonage SMS Gateway</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Twilio Sender Phone Number</label>
              <input type="text" className="input-field" value={twilioPhoneNumber} onChange={(e) => setTwilioPhoneNumber(e.target.value)} />
            </div>
          </div>

          {smsProvider === 'Twilio' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: 'var(--bg-app)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>Twilio API Credentials</div>
              <div className="input-group">
                <label className="input-label">Account SID</label>
                <input type="text" className="input-field" value={twilioAccountSid} onChange={(e) => setTwilioAccountSid(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Auth Token</label>
                <input type="password" className="input-field" value={twilioAuthToken} onChange={(e) => setTwilioAuthToken(e.target.value)} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Save size={16} /> Save SMS Settings
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                if (twilioAccountSid === 'AC994821048290148201') {
                  alert('Please enter your own live Twilio keys first to test the connection.');
                  return;
                }
                const targetPhone = prompt('Enter recipient mobile number (E.164 format, e.g. +447700900077):');
                if (!targetPhone) return;

                const authHeader = 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`);
                const formData = new URLSearchParams();
                formData.append('To', targetPhone);
                formData.append('From', twilioPhoneNumber);
                formData.append('Body', 'Eterna OS Twilio Connection Test Successful.');

                fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
                  method: 'POST',
                  headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  body: formData.toString()
                })
                .then(res => {
                  if (res.ok) alert('Connection Test Successful! A verification text was dispatched to ' + targetPhone);
                  else res.json().then(err => alert('Twilio dispatch failed: ' + err.message));
                })
                .catch(err => alert('Network Connection Test Failed: ' + err));
              }}
            >
              Test SMS Connection
            </button>
          </div>
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
