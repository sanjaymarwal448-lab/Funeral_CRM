import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Folder,
  Calendar,
  Users,
  DollarSign,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Phone,
  Mail,
  Sparkles,
  ArrowUpRight,
  Clock,
  Eye,
  Heart,
  FileText,
  CheckCircle
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export const DashboardView: React.FC = () => {
  const { 
    setCurrentModule, 
    setIsCreateCaseModalOpen, 
    cases, 
    families, 
    invoices, 
    conversations, 
    chatMessages, 
    staff, 
    notifications 
  } = useCRM();

  // Dynamic statistics calculations
  const activeCasesCount = cases.filter(c => c.status !== 'Completed' && c.status !== 'Archived').length;
  const todaysServicesCount = cases.filter(c => c.status === 'Service Scheduled' || c.status === 'In Transit').length;
  const familiesCount = families.length;
  
  // Financial Calculations
  const totalRevenue = cases.reduce((sum, c) => sum + (c.paidAmount || 0), 0);
  const projectedRevenue = cases.reduce((sum, c) => sum + (c.estimatedCost || 0), 0);
  const revenuePercent = projectedRevenue > 0 ? Math.min(100, Math.round((totalRevenue / projectedRevenue) * 100)) : 0;

  // Breakdown classifications
  const arrangementsCount = cases.filter(c => c.status === 'Draft' || c.status === 'Active').length;
  const viewingsCount = cases.filter(c => c.status === 'In Transit').length;
  const othersCount = cases.filter(c => c.status === 'Service Scheduled').length;

  // Map schedule items
  const scheduleItems = cases
    .filter(c => c.status === 'Service Scheduled' || c.status === 'In Transit')
    .map(c => ({
      time: c.funeralTime || '10:00 AM',
      title: c.serviceType || 'Funeral Service',
      desc: c.deceasedName,
      location: c.location || 'Grace Memorial Chapel',
      status: c.status
    })).slice(0, 5);

  // Dynamic progress overview milestone counts
  const milestoneCounts = {
    firstCall: cases.filter(c => c.status === 'Draft').length,
    preparation: cases.filter(c => c.status === 'Active').length,
    viewing: cases.filter(c => c.status === 'In Transit').length,
    funeral: cases.filter(c => c.status === 'Service Scheduled').length,
    aftercare: cases.filter(c => c.status === 'Completed').length
  };

  // Dynamic AI alerts list
  const aiAlerts: { title: string; sub: string; target: string }[] = [];
  
  const draftCases = cases.filter(c => c.status === 'Draft');
  if (draftCases.length > 0) {
    aiAlerts.push({
      title: `${draftCases.length} case file${draftCases.length > 1 ? 's are' : ' is'} in draft status`,
      sub: 'Awaiting director intake completion',
      target: 'Cases'
    });
  }
  
  const unpaidInvoices = invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue');
  if (unpaidInvoices.length > 0) {
    const outstandingSum = unpaidInvoices.reduce((sum, inv) => sum + (inv.totalAmount - inv.paidAmount), 0);
    aiAlerts.push({
      title: `${unpaidInvoices.length} invoice${unpaidInvoices.length > 1 ? 's are' : ' is'} currently unpaid`,
      sub: `Total £${outstandingSum.toLocaleString()} outstanding`,
      target: 'Financials'
    });
  }

  const unreadMessages = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  if (unreadMessages > 0) {
    aiAlerts.push({
      title: `${unreadMessages} unread customer message${unreadMessages > 1 ? 's' : ''}`,
      sub: 'Immediate response recommended',
      target: 'Communications'
    });
  }

  // Communications counts
  const callsCount = chatMessages.filter(m => m.channel === 'AI Voice Transcript').length;
  const textsCount = chatMessages.filter(m => m.channel === 'SMS').length;
  const whatsAppCount = chatMessages.filter(m => m.channel === 'WhatsApp').length;
  const emailsCount = chatMessages.filter(m => m.channel === 'Email').length;

  // Active staff list on duty
  const activeStaff = staff.filter(s => s.status === 'Active');

  // Sparkline Graph Area (defaults to baseline if no revenue yet)
  const chartData = [
    { day: 'May 1', revenue: totalRevenue > 0 ? totalRevenue * 0.4 : 1000 },
    { day: 'May 7', revenue: totalRevenue > 0 ? totalRevenue * 0.55 : 2500 },
    { day: 'May 14', revenue: totalRevenue > 0 ? totalRevenue * 0.7 : 4500 },
    { day: 'May 20', revenue: totalRevenue > 0 ? totalRevenue * 0.8 : 6000 },
    { day: 'May 27', revenue: totalRevenue > 0 ? totalRevenue * 0.9 : 8000 },
    { day: 'May 31', revenue: totalRevenue > 0 ? totalRevenue : 10000 }
  ];

  // Symmetrical Christian Cross SVG Component
  const ChristianCrossIcon = () => (
    <svg width="10" height="15" viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M5 1V14M1.5 5H8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const WhatsAppIcon = ({ size = 14, style }: { size?: number; style?: React.CSSProperties }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.705 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - var(--header-height) - 40px)',
      gap: '16px',
      fontFamily: 'var(--font-family)',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      
      {/* 1. GREETING BANNER HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
            Good morning, Michael 👋
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-body)', marginTop: '2px', margin: 0 }}>
            Here's what's happening across your funeral parlours today.
          </p>
        </div>

        {/* Live Status Pill & Intake Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--primary-accent)',
            backgroundColor: 'var(--primary-light)',
            padding: '6px 14px',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: '1px solid var(--primary-border)'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-accent)', display: 'inline-block' }} />
            Live Ops Active • {todaysServicesCount} Services Today
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setIsCreateCaseModalOpen(true)}
            style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <PlusIcon /> Intake New Case
          </button>
        </div>
      </div>

      {/* 2. TOP 4 HERO METRIC CARDS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', flexShrink: 0 }}>
        {/* Metric 1: Active Cases */}
        <div 
          className="card clickable-card" 
          onClick={() => setCurrentModule('Cases')}
          style={{ padding: '14px 18px', display: 'flex', gap: '14px', alignItems: 'center' }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Folder size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Active Cases</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px', lineHeight: 1.1 }}>{activeCasesCount}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-body)', fontWeight: 500, marginTop: '2px', whiteSpace: 'nowrap' }}>
              {arrangementsCount} Arrangements • {todaysServicesCount} Services Today
            </div>
          </div>
        </div>

        {/* Metric 2: Today's Services */}
        <div 
          className="card clickable-card" 
          onClick={() => setCurrentModule('Calendar')}
          style={{ padding: '14px 18px', display: 'flex', gap: '14px', alignItems: 'center' }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Calendar size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Today's Services</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px', lineHeight: 1.1 }}>{todaysServicesCount}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-body)', fontWeight: 500, marginTop: '2px', whiteSpace: 'nowrap' }}>
              {viewingsCount} Viewings • {othersCount} Funerals
            </div>
          </div>
        </div>

        {/* Metric 3: Families Care */}
        <div 
          className="card clickable-card" 
          onClick={() => setCurrentModule('Families')}
          style={{ padding: '14px 18px', display: 'flex', gap: '14px', alignItems: 'center' }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Users size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Families Care</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px', lineHeight: 1.1 }}>{familiesCount}</div>
            <div style={{ fontSize: '10px', color: 'var(--status-active-text)', fontWeight: 600, marginTop: '2px' }}>
              Associated profiles
            </div>
          </div>
        </div>

        {/* Metric 4: Revenue (This Month) */}
        <div 
          className="card clickable-card" 
          onClick={() => setCurrentModule('Financials')}
          style={{ padding: '14px 18px', display: 'flex', gap: '14px', alignItems: 'center' }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#064e3b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '15px', flexShrink: 0 }}>
            £
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Revenue (This Month)</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px', lineHeight: 1.1 }}>£{totalRevenue.toLocaleString()}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
              <span>Target: £{projectedRevenue.toLocaleString()} • {revenuePercent}%</span>
            </div>
            {/* Inset progress bar */}
            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${revenuePercent}%`, height: '100%', backgroundColor: 'var(--primary-accent)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN 3-COLUMN DASHBOARD GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.15fr 1fr 0.95fr',
        gap: '16px',
        flex: 1,
        minHeight: 0,
        boxSizing: 'border-box'
      }}>
        
        {/* COLUMN 1: Today's Schedule + Case Progress Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: 0 }}>
          
          {/* Today's Schedule Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexShrink: 0 }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, margin: 0 }}>Today's Schedule</h3>
              <button className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '10px' }} onClick={() => setCurrentModule('Calendar')}>
                View Calendar
              </button>
            </div>

            {/* Scrollable list with fixed heights */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', paddingLeft: '14px', paddingRight: '6px' }}>
              {scheduleItems.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px', gap: '8px', textAlign: 'center', padding: '20px 0' }}>
                  <span>No services scheduled for today.</span>
                  <button className="btn btn-secondary btn-sm" style={{ fontSize: '11px' }} onClick={() => setIsCreateCaseModalOpen(true)}>
                    + Intake New Case
                  </button>
                </div>
              ) : (
                <>
                  {/* Vertical line indicator */}
                  <div style={{ position: 'absolute', left: '76px', top: '10px', bottom: '10px', width: '1px', borderLeft: '1px dashed var(--border-color)' }} />
                  {scheduleItems.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setCurrentModule('Calendar')}
                      className="clickable-item"
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', padding: '4px 8px', borderRadius: '6px' }}
                    >
                      {/* Time label */}
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', width: '56px', flexShrink: 0 }}>
                        {item.time}
                      </span>

                      {/* Icon Indicator */}
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1.5px solid var(--primary-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary-accent)',
                        zIndex: 10,
                        flexShrink: 0
                      }}>
                        {item.title === 'Traditional Funeral' ? <ChristianCrossIcon /> : <Clock size={12} />}
                      </div>

                      {/* Body Content */}
                      <div style={{ flex: 1, backgroundColor: 'var(--bg-subtle)', borderRadius: '8px', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)' }}>
                            {item.title} {item.title === 'Traditional Funeral' && <span style={{ marginLeft: '4px', color: 'var(--primary-accent)' }}>✝</span>}
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--text-body)' }}>{item.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Case Progress Overview Card */}
          <div className="card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, margin: 0 }}>Case Progress Overview</h3>
              <span 
                className="clickable-item"
                onClick={() => setCurrentModule('Cases')}
                style={{ fontSize: '10px', fontWeight: 700, color: 'var(--primary-accent)', backgroundColor: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px' }}
              >
                {cases.length} Total Cases
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', padding: '4px 0' }}>
              {/* Connector line behind stages */}
              <div style={{ position: 'absolute', left: '10%', right: '10%', top: '20px', height: '1.5px', backgroundColor: 'var(--border-color)', zIndex: 1 }} />

              {[
                { step: 'First Call', val: milestoneCounts.firstCall, icon: <Phone size={14} /> },
                { step: 'Preparation', val: milestoneCounts.preparation, icon: <FileText size={14} /> },
                { step: 'Viewing', val: milestoneCounts.viewing, icon: <Eye size={14} /> },
                { step: 'Funeral', val: milestoneCounts.funeral, icon: <ChristianCrossIcon /> },
                { step: 'Aftercare', val: milestoneCounts.aftercare, icon: <Heart size={14} /> }
              ].map((step, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setCurrentModule('Cases')}
                  className="clickable-item"
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', zIndex: 5, position: 'relative', padding: '4px', borderRadius: '6px' }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1.5px solid var(--primary-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-accent)',
                    boxShadow: 'var(--shadow-xs)'
                  }}>
                    {step.icon}
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-body)', marginTop: '2px', textAlign: 'center' }}>
                    {step.step}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-main)', marginTop: '1px' }}>
                    {step.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: AI Assistant + Revenue Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: 0 }}>
          
          {/* AI Assistant Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', flex: 1.1, minHeight: 0, padding: '14px 16px', border: '1px dashed var(--primary-accent)', background: 'rgba(122, 144, 115, 0.01)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexShrink: 0 }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} style={{ color: 'var(--primary-accent)' }} /> AI Assistant
              </h3>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '6px' }}>
              {aiAlerts.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#059669', fontSize: '12px', gap: '8px', padding: '20px 0' }}>
                  <CheckCircle size={32} />
                  <span>All tasks completed. AI Standby.</span>
                </div>
              ) : (
                <>
                  {/* Alert Header Banner */}
                  <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-accent)', padding: '8px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--primary-accent)', color: '#ffffff', fontSize: '9px' }}>
                      {aiAlerts.length}
                    </span>
                    <span>pending items that need attention</span>
                  </div>

                  {aiAlerts.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setCurrentModule(item.target as any)}
                      className="clickable-item"
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                    >
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>{item.title}</div>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.sub}</div>
                      </div>
                      <ChevronRight size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    </div>
                  ))}
                </>
              )}
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '8px 0', fontSize: '11px', marginTop: '10px', flexShrink: 0 }}
              onClick={() => setCurrentModule('AI Assistant')}
            >
              <Sparkles size={12} style={{ marginRight: '4px' }} /> Open AI Assistant
            </button>
          </div>

          {/* Revenue Overview Card */}
          <div 
            className="card clickable-card" 
            onClick={() => setCurrentModule('Financials')}
            style={{ display: 'flex', flexDirection: 'column', flex: 0.9, minHeight: 0, padding: '14px 16px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexShrink: 0 }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, margin: 0 }}>Revenue Overview</h3>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>May 1 - May 31</span>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '6px', flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Collected</div>
                <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>£{totalRevenue.toLocaleString()}</strong>
              </div>
              <div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Projected</div>
                <strong style={{ fontSize: '14px', color: 'var(--text-main)', opacity: 0.7 }}>£{projectedRevenue.toLocaleString()}</strong>
              </div>
            </div>

            {/* Sparkline Graph Area */}
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7A9073" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#7A9073" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="revenue" stroke="#7A9073" strokeWidth={2} fillOpacity={1} fill="url(#revenueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Communications + Recent Activity + Staff On Duty */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: 0 }}>
          
          {/* Communications Today Card */}
          <div className="card" style={{ padding: '14px 16px', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, margin: 0 }}>Communications (Today)</h3>
              <button 
                className="btn btn-secondary btn-sm" 
                style={{ padding: '2px 6px', fontSize: '9px' }}
                onClick={() => setCurrentModule('Communications')}
              >
                View All
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div 
                onClick={() => setCurrentModule('Communications')}
                className="clickable-item"
                style={{ padding: '8px 10px', backgroundColor: 'var(--status-urgent-bg)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Phone size={14} style={{ color: 'var(--status-urgent-text)' }} />
                <div>
                  <div style={{ fontSize: '9px', color: 'var(--status-urgent-text)', fontWeight: 600 }}>Calls</div>
                  <strong style={{ fontSize: '14px', color: 'var(--status-urgent-text)' }}>{callsCount}</strong>
                </div>
              </div>

              <div 
                onClick={() => setCurrentModule('Communications')}
                className="clickable-item"
                style={{ padding: '8px 10px', backgroundColor: 'var(--status-scheduled-bg)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <MessageSquare size={14} style={{ color: 'var(--status-scheduled-text)' }} />
                <div>
                  <div style={{ fontSize: '9px', color: 'var(--status-scheduled-text)', fontWeight: 600 }}>Texts</div>
                  <strong style={{ fontSize: '14px', color: 'var(--status-scheduled-text)' }}>{textsCount}</strong>
                </div>
              </div>

              <div 
                onClick={() => setCurrentModule('Communications')}
                className="clickable-item"
                style={{ padding: '8px 10px', backgroundColor: 'var(--status-active-bg)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <WhatsAppIcon size={14} style={{ color: 'var(--status-active-text)' }} />
                <div>
                  <div style={{ fontSize: '9px', color: 'var(--status-active-text)', fontWeight: 600 }}>WhatsApp</div>
                  <strong style={{ fontSize: '14px', color: 'var(--status-active-text)' }}>{whatsAppCount}</strong>
                </div>
              </div>

              <div 
                onClick={() => setCurrentModule('Communications')}
                className="clickable-item"
                style={{ padding: '8px 10px', backgroundColor: 'var(--status-transit-bg)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Mail size={14} style={{ color: 'var(--status-transit-text)' }} />
                <div>
                  <div style={{ fontSize: '9px', color: 'var(--status-transit-text)', fontWeight: 600 }}>Emails</div>
                  <strong style={{ fontSize: '14px', color: 'var(--status-transit-text)' }}>{emailsCount}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: '14px 16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, margin: 0, marginBottom: '10px', flexShrink: 0 }}>Recent Activity</h3>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '6px' }}>
              {notifications.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '11px', textAlign: 'center' }}>
                  No recent operations activity.
                </div>
              ) : (
                notifications.slice(0, 5).map((activity, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => activity.linkModule && setCurrentModule(activity.linkModule as any)}
                    className="clickable-item"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '11px', borderBottom: '1px solid var(--border-light)', padding: '4px 8px', borderRadius: '6px' }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{activity.title}</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '1px' }}>{activity.message}</div>
                    </div>
                    <span style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>{activity.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Staff On Duty Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexShrink: 0 }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, margin: 0 }}>Staff On Duty</h3>
              <button 
                className="btn btn-secondary btn-sm" 
                style={{ padding: '2px 6px', fontSize: '9px' }}
                onClick={() => setCurrentModule('Staff & Resources')}
              >
                View All
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '6px' }}>
              {activeStaff.length === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                  No staff currently logged as active.
                </div>
              ) : (
                activeStaff.map((member, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setCurrentModule('Staff & Resources')}
                    className="clickable-item"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', padding: '4px 8px', borderRadius: '6px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '10px'
                      }}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{member.name}</div>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{member.position}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '9px', color: 'var(--status-active-text)', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--primary-accent)' }} /> On Duty
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Inline helper for PlusIcon to avoid importing extra icons
const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2.5V9.5M2.5 6H9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
