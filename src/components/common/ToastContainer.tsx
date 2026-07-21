import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCRM();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        pointerEvents: 'none'
      }}
    >
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        const bgColor = isSuccess ? '#ecfdf5' : isError ? '#fff1f2' : isWarning ? '#fffbe finished' : '#eff6ff';
        const borderColor = isSuccess ? '#a7f3d0' : isError ? '#fecdd3' : isWarning ? '#fde68a' : '#bfdbfe';
        const textColor = isSuccess ? '#047857' : isError ? '#e11d48' : isWarning ? '#b45309' : '#1d4ed8';

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: bgColor,
              border: `1px solid ${borderColor}`,
              color: textColor,
              boxShadow: 'var(--shadow-lg)',
              animation: 'slideInRight 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isSuccess && <CheckCircle2 size={18} />}
              {isError && <AlertCircle size={18} />}
              {isWarning && <AlertTriangle size={18} />}
              {!isSuccess && !isError && !isWarning && <Info size={18} />}
              <span>{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'currentColor',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
