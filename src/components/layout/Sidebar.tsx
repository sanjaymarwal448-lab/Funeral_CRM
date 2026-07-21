import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Calendar,
  CheckSquare,
  FileText,
  CreditCard,
  Truck,
  Package,
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
  const { currentModule, setCurrentModule, isSidebarCollapsed, setIsSidebarCollapsed, cases, tasks, invoices } = useCRM();

  const activeCasesCount = cases.filter(c => c.status !== 'Completed' && c.status !== 'Archived').length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'Completed').length;
  const pendingInvoicesCount = invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').length;

  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Cases', icon: FolderKanban, badge: activeCasesCount },
    { name: 'Families', icon: Users },
    { name: 'Calendar', icon: Calendar },
    { name: 'Tasks', icon: CheckSquare, badge: pendingTasksCount },
    { name: 'Documents', icon: FileText },
    { name: 'Invoices', icon: CreditCard, badge: pendingInvoicesCount },
    { name: 'Vehicles', icon: Truck },
    { name: 'Inventory', icon: Package },
    { name: 'Staff', icon: UserCheck },
    { name: 'Reports', icon: BarChart3 },
    { name: 'Settings', icon: Settings },
  ];

  const sidebarWidth = isSidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)';

  return (
    <aside
      style={{
        width: sidebarWidth,
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--transition-normal)',
        zIndex: 40,
        boxShadow: 'var(--shadow-md)',
        flexShrink: 0
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
          padding: isSidebarCollapsed ? '0 12px' : '0 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        {!isSidebarCollapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#ffffff',
                fontSize: '15px'
              }}
            >
              E
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.02em', color: '#ffffff' }}>
                ELYSIUM
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Funeral CRM
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#ffffff'
            }}
          >
            E
          </div>
        )}

        <button
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: 'none',
            color: '#94a3b8',
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation List */}
      <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
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
                  backgroundColor: isActive ? '#2563eb' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  width: '100%',
                  textAlign: 'left'
                }}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} style={{ color: isActive ? '#ffffff' : '#94a3b8', flexShrink: 0 }} />
                  {!isSidebarCollapsed && <span>{item.name}</span>}
                </div>

                {!isSidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      padding: '2px 7px',
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
            padding: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '13px'
            }}
          >
            MV
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Marcus Vance
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Senior Director</div>
          </div>
        </div>
      )}
    </aside>
  );
};
