import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Search, Plus, Bell, Mail, HelpCircle } from 'lucide-react';
import { NotificationPopover } from '../common/NotificationPopover';

export const Header: React.FC = () => {
  const { searchQuery, setSearchQuery, setIsCreateCaseModalOpen, setCurrentModule } = useCRM();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxSizing: 'border-box'
      }}
    >
      {/* Left: Search Container */}
      <div style={{ flex: '0 1 360px', position: 'relative', display: 'flex', alignItems: 'center' }}>
        <div className="search-input-wrapper" style={{ width: '100%' }}>
          <Search size={15} className="search-icon" style={{ left: '10px' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search anything... (e.g. Cases, Families, Documents)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '32px',
              paddingRight: '48px',
              height: '32px',
              borderRadius: '6px',
              fontSize: '12px',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              width: '100%'
            }}
          />
          {/* ⌘ K Pill */}
          <div
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '10px',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              padding: '2px 6px',
              borderRadius: '4px',
              pointerEvents: 'none',
              fontFamily: 'monospace',
              fontWeight: 600
            }}
          >
            ⌘ K
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Circle green intake button (+) */}
        <button
          onClick={() => setIsCreateCaseModalOpen(true)}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-accent)',
            color: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
            transition: 'background-color 0.15s'
          }}
          title="New Case Intake"
        >
          <Plus size={16} />
        </button>

        {/* Bell with badge 8 */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsNotifOpen(prev => !prev)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px'
            }}
            title="Notifications"
          >
            <Bell size={20} />
          </button>
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-urgent-text)',
              color: '#ffffff',
              fontSize: '9px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            8
          </span>
        </div>

        {/* Mail with badge 4 */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setCurrentModule('Communications')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px'
            }}
            title="Messages"
          >
            <Mail size={20} />
          </button>
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              fontSize: '9px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            4
          </span>
        </div>

        {/* Help icon */}
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px'
          }}
          title="Help"
        >
          <HelpCircle size={20} />
        </button>

        <NotificationPopover
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
        />
      </div>
    </header>
  );
};
