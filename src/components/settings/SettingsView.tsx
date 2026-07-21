import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Settings, Building, Globe, Shield, DollarSign, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useCRM();

  const [companyName, setCompanyName] = useState(settings.companyName);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [currency, setCurrency] = useState(settings.currency);
  const [timeZone, setTimeZone] = useState(settings.timeZone);
  const [taxRate, setTaxRate] = useState(settings.taxRate);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      companyName,
      address,
      phone,
      email,
      currency,
      timeZone,
      taxRate: Number(taxRate)
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px' }}>
      {/* Header */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Company & Organization Settings</h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Manage enterprise details, branding, tax rates, and security roles</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Business Profile */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Business Information</h3>
          </div>
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">Funeral Home / Enterprise Name</label>
              <input
                type="text"
                className="input-field"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">Physical Address</label>
              <input
                type="text"
                className="input-field"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Contact Phone</label>
              <input
                type="text"
                className="input-field"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Official Email</label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Regional & Financial */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Regional & Financial Configurations</h3>
          </div>
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Default Currency</label>
              <select className="input-field" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
                <option value="CAD ($)">CAD ($) - Canadian Dollar</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">System Time Zone</label>
              <select className="input-field" value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
                <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                <option value="America/New_York (EST)">America/New_York (EST)</option>
                <option value="America/Chicago (CST)">America/Chicago (CST)</option>
                <option value="Europe/London (GMT)">Europe/London (GMT)</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Sales Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                className="input-field"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {savedSuccess ? (
            <span style={{ fontSize: '13px', color: '#047857', fontWeight: 700 }}>
              ✓ Settings saved successfully!
            </span>
          ) : <div />}

          <button type="submit" className="btn btn-primary">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
