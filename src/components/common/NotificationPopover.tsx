import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { Bell, CheckCheck, Trash2, X, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPopover: React.FC<Props> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications, setCurrentModule, setActiveCaseId } = useCRM();

  if (!isOpen) return null;

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={onClose} />
      <div
        style={{
          position: 'absolute',
          top: '54px',
          right: '80px',
          width: '380px',
          maxHeight: '480px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
          zIndex: 95,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'scaleUp 0.15s ease'
        }}
      >
        {/* Header */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={16} style={{ color: 'var(--primary-accent)' }} />
            <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Notifications Center</h4>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button className="btn btn-ghost btn-sm btn-icon-only" onClick={markAllNotificationsRead} title="Mark All as Read">
              <CheckCheck size={14} />
            </button>
            <button className="btn btn-ghost btn-sm btn-icon-only" onClick={clearNotifications} title="Clear All">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No notifications at present.
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => {
                  markNotificationRead(n.id);
                  if (n.linkModule) setCurrentModule(n.linkModule);
                  if (n.linkId && n.linkModule === 'Cases') setActiveCaseId(n.linkId);
                  onClose();
                }}
                style={{
                  padding: '12px 18px',
                  borderBottom: '1px solid var(--border-light)',
                  backgroundColor: n.read ? 'transparent' : 'var(--primary-light)',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: n.read ? 600 : 700, color: 'var(--text-main)' }}>{n.title}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>{n.timestamp}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-body)', marginTop: '3px' }}>{n.message}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
