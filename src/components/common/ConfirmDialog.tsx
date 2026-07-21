import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmDialog: React.FC = () => {
  const { confirmDialog, closeConfirmDialog } = useCRM();

  if (!confirmDialog || !confirmDialog.isOpen) return null;

  const handleConfirm = () => {
    confirmDialog.onConfirm();
    closeConfirmDialog();
  };

  const isDanger = confirmDialog.variant === 'danger';

  return (
    <div className="modal-backdrop" style={{ zIndex: 9000 }}>
      <div className="modal-card" style={{ maxWidth: '420px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: isDanger ? '#fff1f2' : '#fffbe finished',
              color: isDanger ? '#e11d48' : '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <AlertTriangle size={20} />
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
              {confirmDialog.title}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
              {confirmDialog.message}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <button className="btn btn-secondary" onClick={closeConfirmDialog}>
            {confirmDialog.cancelText || 'Cancel'}
          </button>
          <button
            className={`btn ${isDanger ? 'btn-primary' : 'btn-dark'}`}
            style={{ backgroundColor: isDanger ? '#e11d48' : undefined }}
            onClick={handleConfirm}
          >
            {confirmDialog.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
