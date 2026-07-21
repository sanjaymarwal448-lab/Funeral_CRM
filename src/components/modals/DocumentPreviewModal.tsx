import React from 'react';
import { CaseDocument } from '../../types/crm';
import { X, Download, FileText, ShieldCheck } from 'lucide-react';

interface Props {
  doc: CaseDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<Props> = ({ doc, isOpen, onClose }) => {
  if (!isOpen || !doc) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '650px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} style={{ color: 'var(--primary-accent)' }} />
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{doc.name}</h3>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{doc.category} • {doc.size} • Uploaded {doc.uploadDate}</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon-only" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Mock Preview Box */}
        <div
          style={{
            height: '320px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center'
          }}
        >
          <ShieldCheck size={48} style={{ color: 'var(--primary-accent)', marginBottom: '12px' }} />
          <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Document Encrypted & Verified</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '360px' }}>
            This document is stored securely in the Elysium vault. Official record ID: {doc.id}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Case: {doc.caseName || 'Unlinked General Record'}</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
            <button className="btn btn-primary" onClick={onClose}><Download size={16} /> Download Copy</button>
          </div>
        </div>
      </div>
    </div>
  );
};
