import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { NotificationPopover } from '../common/NotificationPopover';
import { Search, Plus, Bell, Calendar as CalendarIcon, HelpCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentModule, searchQuery, setSearchQuery, setIsCreateCaseModalOpen, notifications } = useCRM();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxShadow: 'var(--shadow-xs)'
      }}
    >
      {/* Title & Path */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
          {currentModule}
        </h1>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '999px',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-muted)'
          }}
        >
          Elysium Directors Suite
        </span>
      </div>

      {/* Center Global Search */}
      <div style={{ flex: '0 1 420px' }}>
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="input-field"
            placeholder="Search deceased name, case #, family contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderRadius: 'var(--radius-full)' }}
          />
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
        {/* Today's Date */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            fontWeight: 500,
            padding: '6px 12px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <CalendarIcon size={14} />
          <span>Tuesday, July 21, 2026</span>
        </div>

        {/* Notifications */}
        <button
          className="btn btn-secondary btn-icon-only"
          style={{ position: 'relative' }}
          onClick={() => setIsNotifOpen(prev => !prev)}
          title="Notifications Center"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                minWidth: '16px',
                height: '16px',
                borderRadius: '999px',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px'
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        <NotificationPopover
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
        />

        {/* Quick Help */}
        <button className="btn btn-secondary btn-icon-only" title="Help & Documentation">
          <HelpCircle size={18} />
        </button>

        {/* Quick New Case Button */}
        <button
          className="btn btn-primary"
          onClick={() => setIsCreateCaseModalOpen(true)}
        >
          <Plus size={16} />
          <span>New Case</span>
        </button>
      </div>
    </header>
  );
};
