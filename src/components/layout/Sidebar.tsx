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
import brandLogoImg from '../../assets/logo.png';

interface NavItem {
  name: string;
  icon: React.ElementType;
  badge?: number;
}

const WhatsAppSidebarIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.705 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

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
    { name: 'Communications', icon: WhatsAppSidebarIcon, badge: unreadConversationsCount },
    { name: 'AI Assistant', icon: Sparkles },
    { name: 'Reports', icon: BarChart3 },
    { name: 'Staff & Resources', icon: UserCheck },
    { name: 'Financials', icon: CreditCard, badge: pendingInvoicesCount },
    { name: 'Documents', icon: FileText },
    { name: 'Settings', icon: Settings },
  ];

  const sidebarWidth = isSidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)';

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2px',
                boxSizing: 'border-box'
              }}
            >
              <img src={brandLogoImg} alt="Evergreen Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <div className="brand-title" style={{ fontSize: '17px', fontWeight: '700', letterSpacing: '0.04em', color: '#ffffff', lineHeight: 1.1 }}>
                Evergreen
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600', marginTop: '2px' }}>
                Funeral Homes
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              cursor: 'pointer',
              padding: '2px'
            }}
            title="Expand Sidebar"
          >
            <img src={brandLogoImg} alt="Evergreen Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </button>
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
