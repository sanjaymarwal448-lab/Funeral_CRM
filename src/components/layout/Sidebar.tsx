import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  MessageSquare,
  Calendar,
  Sparkles,
  FileText,
  CreditCard,
  UserCheck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  name: string;
  icon: React.ElementType;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const { currentModule, setCurrentModule, isSidebarCollapsed, setIsSidebarCollapsed, cases, invoices, conversations } = useCRM();

  const activeCasesCount = cases.filter(c => c.status !== 'Completed' && c.status !== 'Archived').length;
  const pendingInvoicesCount = invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').length;
  const unreadConversationsCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Cases', icon: FolderKanban, badge: activeCasesCount },
    { name: 'Families', icon: Users },
    { name: 'Calendar', icon: Calendar },
    { name: 'Communications', icon: MessageSquare, badge: unreadConversationsCount },
    { name: 'AI Assistant', icon: Sparkles },
    { name: 'Reports', icon: BarChart3 },
    { name: 'Staff & Resources', icon: UserCheck },
    { name: 'Financials', icon: CreditCard, badge: pendingInvoicesCount },
    { name: 'Documents', icon: FileText },
    { name: 'Settings', icon: Settings },
  ];

  const sidebarWidth = isSidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)';

  // High-fidelity recreation of the attached branching leaf emblem logo
  const BrandLogo = () => (
    <svg viewBox="0 0 100 100" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#9CA88E' }}>
      {/* Stem */}
      <path d="M50 90C50 90 50 42 50 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      {/* Top center leaf */}
      <path d="M50 35C47 25 50 15 50 15C50 15 53 25 50 35Z" fill="currentColor"/>
      {/* Upper pair of leaves */}
      <path d="M50 48C39 39 39 30 43 27C47 24 49 33 50 40Z" fill="currentColor"/>
      <path d="M50 48C61 39 61 30 57 27C53 24 51 33 50 40Z" fill="currentColor"/>
      {/* Middle pair of leaves */}
      <path d="M50 62C32 54 28 45 34 41C40 37 46 48 50 55Z" fill="currentColor"/>
      <path d="M50 62C68 54 72 45 66 41C60 37 54 48 50 55Z" fill="currentColor"/>
      {/* Lower pair of leaves */}
      <path d="M50 72C36 68 34 61 38 57C42 53 47 62 50 67Z" fill="currentColor"/>
      <path d="M50 72C64 68 66 61 62 57C58 53 53 62 50 67Z" fill="currentColor"/>
      {/* Small lowest pair of leaves */}
      <path d="M50 80C43 80 40 75 43 73C46 71 48 76 50 78Z" fill="currentColor"/>
      <path d="M50 80C57 80 60 75 57 73C54 71 52 76 50 78Z" fill="currentColor"/>
    </svg>
  );

  return (
    <aside
      style={{
        width: sidebarWidth,
        backgroundColor: 'var(--bg-sidebar-header)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--transition-normal)',
        zIndex: 40,
        flexShrink: 0
      }}
    >
      {/* Brand Header (Dark luxury slate - enlarged to 88px) */}
      <div
        style={{
          height: '88px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
          padding: isSidebarCollapsed ? '0 12px' : '0 20px',
          backgroundColor: 'var(--bg-sidebar-header)',
          color: '#ffffff',
          boxSizing: 'border-box'
        }}
      >
        {!isSidebarCollapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <BrandLogo />
            </div>
            <div>
              <div className="brand-title" style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '0.04em', color: '#ffffff', lineHeight: 1.1 }}>
                Evergreen
              </div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600', marginTop: '2px' }}>
                Funeral Homes
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }}
          >
            <BrandLogo />
          </div>
        )}

        {!isSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#ffffff',
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
            title="Collapse Sidebar"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Main Body Wrapper (Pure white, with curvy top transition) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-surface)',
          borderTopLeftRadius: '22px',
          borderRight: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}
      >
        {/* Navigation List */}
        <div style={{ flex: 1, padding: '24px 12px 16px', overflowY: 'auto' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentModule === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => setCurrentModule(item.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                    padding: isSidebarCollapsed ? '10px 0' : '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--bg-active)' : 'transparent',
                    color: isActive ? 'var(--primary-accent)' : 'var(--text-main)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    width: '100%',
                    textAlign: 'left'
                  }}
                  title={isSidebarCollapsed ? item.name : undefined}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={18} style={{ color: isActive ? 'var(--primary-accent)' : 'var(--text-muted)', flexShrink: 0 }} />
                    {!isSidebarCollapsed && <span>{item.name}</span>}
                  </div>

                  {!isSidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        backgroundColor: isActive ? 'var(--primary-accent)' : 'var(--bg-subtle)',
                        color: isActive ? '#ffffff' : 'var(--text-main)',
                        padding: '2px 6px',
                        borderRadius: '999px'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Profile Status */}
        {!isSidebarCollapsed && (
          <div
            style={{
              padding: '14px 16px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'var(--bg-subtle)'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-accent)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '12px'
              }}
            >
              MA
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Michael Anderson
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Owner ▾
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
