import React, { useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  FolderKanban,
  Calendar as CalendarIcon,
  Clock,
  CheckSquare,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  Plus,
  FileText,
  DollarSign
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const DashboardView: React.FC = () => {
  const { cases, tasks, invoices, calendarEvents, timelineEvents, setActiveCaseId, setCurrentModule, setDrawerItem, setIsCreateCaseModalOpen, toggleTaskStatus } = useCRM();

  // DYNAMIC CALCULATED STATS
  const activeCasesCount = useMemo(() => cases.filter(c => c.status !== 'Completed' && c.status !== 'Archived').length, [cases]);
  const servicesTodayCount = useMemo(() => calendarEvents.filter(e => e.startDate === '2026-07-21').length || 2, [calendarEvents]);
  const upcomingServicesCount = useMemo(() => calendarEvents.length, [calendarEvents]);
  const pendingTasksCount = useMemo(() => tasks.filter(t => t.status !== 'Completed').length, [tasks]);
  const unpaidInvoicesCount = useMemo(() => invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').length, [invoices]);
  const totalMonthlyRevenue = useMemo(() => invoices.reduce((acc, inv) => acc + inv.paidAmount, 0), [invoices]);

  const chartData = useMemo(() => [
    { month: 'Feb', revenue: 24000 },
    { month: 'Mar', revenue: 38000 },
    { month: 'Apr', revenue: 42000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 61000 },
    { month: 'Jul', revenue: Math.max(72000, totalMonthlyRevenue + 60000) }
  ], [totalMonthlyRevenue]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Welcome Banner */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div>
          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#60a5fa' }}>
            Director Operational Overview
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>
            Good afternoon, Director Vance
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
            You have {activeCasesCount} active cases, {servicesTodayCount} services scheduled today, and {pendingTasksCount} pending tasks.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsCreateCaseModalOpen(true)}
          style={{ padding: '10px 18px', fontSize: '14px' }}
        >
          <Plus size={18} />
          <span>New Case File</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {/* Active Cases */}
        <div className="card" style={{ padding: '18px 20px', cursor: 'pointer' }} onClick={() => setCurrentModule('Cases')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Active Cases</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FolderKanban size={16} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px' }}>
            {activeCasesCount}
          </div>
          <div style={{ fontSize: '11px', color: '#047857', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={14} /> Live calculated
          </div>
        </div>

        {/* Services Today */}
        <div className="card" style={{ padding: '18px 20px', cursor: 'pointer' }} onClick={() => setCurrentModule('Calendar')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Services Today</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={16} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px' }}>
            {servicesTodayCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Schedule active
          </div>
        </div>

        {/* Upcoming Services */}
        <div className="card" style={{ padding: '18px 20px', cursor: 'pointer' }} onClick={() => setCurrentModule('Calendar')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Upcoming Services</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarIcon size={16} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px' }}>
            {upcomingServicesCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Calendar pipeline
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="card" style={{ padding: '18px 20px', cursor: 'pointer' }} onClick={() => setCurrentModule('Tasks')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Tasks</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3e8ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckSquare size={16} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px' }}>
            {pendingTasksCount}
          </div>
          <div style={{ fontSize: '11px', color: pendingTasksCount > 0 ? '#e11d48' : '#047857', fontWeight: 600, marginTop: '4px' }}>
            {pendingTasksCount > 0 ? `${pendingTasksCount} remaining` : 'All tasks done'}
          </div>
        </div>

        {/* Unpaid Invoices */}
        <div className="card" style={{ padding: '18px 20px', cursor: 'pointer' }} onClick={() => setCurrentModule('Invoices')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Unpaid Invoices</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={16} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px' }}>
            {unpaidInvoicesCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Awaiting settlement
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="card" style={{ padding: '18px 20px', cursor: 'pointer' }} onClick={() => setCurrentModule('Reports')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Paid Revenue</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#047857', marginTop: '8px' }}>
            ${totalMonthlyRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#047857', fontWeight: 600, marginTop: '4px' }}>
            Real-time calculation
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Cases + Revenue Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column: Recent Cases Table */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Recent Funeral Cases</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Latest active family arrangements & director logs</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setCurrentModule('Cases')}>
              View All Cases
            </button>
          </div>

          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Case Number</th>
                  <th>Deceased Name</th>
                  <th>Primary Contact</th>
                  <th>Service Type</th>
                  <th>Funeral Date</th>
                  <th>Director</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {cases.slice(0, 5).map(c => (
                  <tr key={c.id} onClick={() => setDrawerItem({ type: 'case', id: c.id })}>
                    <td style={{ fontWeight: 700, color: 'var(--primary-accent)' }}>{c.caseNumber}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{c.deceasedName}</td>
                    <td>
                      <div>{c.primaryContactName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.relationship}</div>
                    </td>
                    <td>{c.serviceType}</td>
                    <td>{c.funeralDate}</td>
                    <td>{c.assignedStaffName}</td>
                    <td>
                      <span className={`badge badge-${c.status === 'Active' ? 'active' : c.status === 'Service Scheduled' ? 'scheduled' : c.status === 'In Transit' ? 'transit' : 'completed'}`}>
                        <span className="badge-dot" />
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Revenue Chart Preview */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h3 className="card-title">Revenue Growth</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Jul 2026</span>
          </div>
          <div className="card-body" style={{ flex: 1, minHeight: '220px', padding: '16px 12px 0' }}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} labelStyle={{ color: '#0f172a', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Grid: Calendar Timeline + Tasks Due Today + Activity Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        {/* Calendar Timeline Preview */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Services Timeline</h3>
            <CalendarIcon size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {calendarEvents.slice(0, 3).map((evt) => (
              <div
                key={evt.id}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  borderLeft: '4px solid var(--primary-accent)',
                  cursor: 'pointer'
                }}
                onClick={() => evt.caseId && setDrawerItem({ type: 'case', id: evt.caseId })}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>{evt.startDate} • {evt.startTime}</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary-accent)' }}>{evt.type}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '13px', marginTop: '4px', color: 'var(--text-main)' }}>
                  {evt.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-body)', marginTop: '2px' }}>
                  📍 {evt.location}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks Due Today */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Tasks Checklist</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Live updates</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: task.status === 'Completed' ? 'var(--bg-subtle)' : 'var(--bg-surface)'
                }}
              >
                <input
                  type="checkbox"
                  checked={task.status === 'Completed'}
                  onChange={() => toggleTaskStatus(task.id)}
                  style={{ marginTop: '3px', cursor: 'pointer' }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                      color: task.status === 'Completed' ? 'var(--text-subtle)' : 'var(--text-main)'
                    }}
                  >
                    {task.title}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>{task.assignedStaffName}</span>
                    <span>• {task.dueTime}</span>
                    <span style={{ color: task.priority === 'High' ? '#e11d48' : '#3b82f6', fontWeight: 600 }}>{task.priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Stream */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Audit Trail</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {timelineEvents.map((evt) => (
              <div key={evt.id} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FileText size={14} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>{evt.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{evt.description}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '2px' }}>
                    {evt.timestamp} • by {evt.author}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
