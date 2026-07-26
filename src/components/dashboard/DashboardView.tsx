import React, { useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Folder,
  Calendar,
  Users,
  DollarSign,
  Briefcase,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Phone,
  Mail,
  Sparkles,
  AlertCircle,
  Clock,
  UserCheck,
  CheckCircle,
  FileText
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const DashboardView: React.FC = () => {
  const { setCurrentModule, setIsCreateCaseModalOpen } = useCRM();

  // Mock revenue chart data matching May 2025 growth curve
  const chartData = [
    { day: 'May 1', revenue: 42000 },
    { day: 'May 7', revenue: 48000 },
    { day: 'May 14', revenue: 62000 },
    { day: 'May 20', revenue: 84000 },
    { day: 'May 27', revenue: 91000 },
    { day: 'May 31', revenue: 98000 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'var(--font-family)' }}>
      {/* Welcome Title Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Good morning, Michael 👋
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-body)', marginTop: '4px' }}>
            Here's what's happening with your business today.
          </p>
        </div>

        {/* Date Widget */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
          <Calendar size={16} style={{ color: 'var(--primary-accent)' }} />
          <span>Tuesday, May 20, 2025</span>
        </div>
      </div>

      {/* KPI TOP METRIC CARDS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {/* Active Cases */}
        <div className="card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Folder size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Active Cases</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>28</div>
            <div style={{ fontSize: '11px', color: 'var(--status-active-text)', fontWeight: 600, marginTop: '2px' }}>
              ↑ 12% from last month
            </div>
          </div>
        </div>

        {/* Today's Services */}
        <div className="card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Today's Services</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>14</div>
            <div style={{ fontSize: '11px', color: 'var(--text-body)', fontWeight: 500, marginTop: '2px' }}>
              8 Arrangements • 3 Viewings • 3 Others
            </div>
          </div>
        </div>

        {/* Families */}
        <div className="card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Families</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>56</div>
            <div style={{ fontSize: '11px', color: 'var(--status-active-text)', fontWeight: 600, marginTop: '2px' }}>
              ↑ 8% from last month
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#064e3b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px' }}>
            £
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Revenue (This Month)</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>£84,000</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>Projected: £102,000</span>
              <strong style={{ color: 'var(--text-main)' }}>82%</strong>
            </div>
            {/* Progress Bar */}
            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
              <div style={{ width: '82%', height: '100%', backgroundColor: 'var(--primary-accent)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION GRID - 3 COLUMNS */}
      <div style={{ display: 'grid', gridTemplateColumns: '38% 32% 30%', gap: '20px' }}>
        {/* Column 1: Today's Schedule */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header" style={{ padding: '16px 20px' }}>
            <h3 className="card-title">Today's Schedule</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setCurrentModule('Calendar')}>
              View Calendar
            </button>
          </div>

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, position: 'relative' }}>
            {/* Vertical Line */}
            <div style={{ position: 'absolute', left: '80px', top: '30px', bottom: '30px', width: '2px', borderLeft: '2px dashed var(--border-color)' }} />

            {[
              { time: '09:00 AM', title: 'Family Meeting', desc: 'Johnson Family', loc: 'Meeting Room 1' },
              { time: '11:00 AM', title: 'Viewing', desc: 'Williams Family', loc: 'Chapel A' },
              { time: '01:00 PM', title: 'Funeral Service', desc: 'Davis Family', loc: 'Main Chapel' },
              { time: '03:00 PM', title: 'Transfer', desc: 'From City Hospital', loc: 'Vehicle #3' },
              { time: '05:00 PM', title: 'Family Meeting', desc: 'Brown Family', loc: 'Meeting Room 2' }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 5 }}>
                {/* Time */}
                <div style={{ width: '65px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {item.time}
                </div>

                {/* Dot / Icon */}
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--bg-surface)', border: '2px solid var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, flexShrink: 0 }} />

                {/* Body */}
                <div style={{ flex: 1, padding: '10px 14px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '12px', color: 'var(--text-main)' }}>{item.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-body)', marginTop: '2px' }}>{item.desc}</div>
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    {item.loc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: AI Assistant Alerts */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', border: '1px dashed var(--primary-accent)', background: 'rgba(122, 144, 115, 0.02)' }}>
          <div className="card-header" style={{ padding: '16px 20px' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--primary-accent)' }} /> AI Assistant
            </h3>
          </div>

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {/* Attention Banner */}
            <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-accent)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--primary-accent)', color: '#ffffff', fontSize: '10px' }}>
                4
              </span>
              <span>pending items that need your attention</span>
            </div>

            {/* List of Alerts */}
            {[
              { title: 'Johnson Family is waiting for document signatures', desc: '2 documents pending' },
              { title: 'Smith Family obituary needs approval', desc: 'Created 2 hours ago' },
              { title: '2 invoices are currently unpaid', desc: 'Total £4,250 outstanding' },
              { title: 'Staff conflict detected for tomorrow', desc: '2 scheduling conflicts' }
            ].map((alert, idx) => (
              <div
                key={idx}
                className="card"
                style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.15s' }}
                onClick={() => setCurrentModule('Communications')}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>{alert.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{alert.desc}</div>
                </div>
                <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
            ))}

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 'auto', gap: '6px' }}
              onClick={() => setCurrentModule('Communications')}
            >
              <Sparkles size={14} /> Open AI Assistant
            </button>
          </div>
        </div>

        {/* Column 3: Communications & Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Communications Today */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700 }}>Communications (Today)</h4>
              <button className="btn btn-ghost btn-sm" onClick={() => setCurrentModule('Communications')}>View All</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ padding: '12px', backgroundColor: '#eafaf1', borderRadius: 'var(--radius-md)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={16} style={{ color: '#10b981' }} />
                <div>
                  <div style={{ fontSize: '10px', color: '#047857', fontWeight: 600 }}>Calls</div>
                  <strong style={{ fontSize: '16px', color: '#047857' }}>26</strong>
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: '#eff6ff', borderRadius: 'var(--radius-md)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <MessageSquare size={16} style={{ color: '#2563eb' }} />
                <div>
                  <div style={{ fontSize: '10px', color: '#1d4ed8', fontWeight: 600 }}>Texts</div>
                  <strong style={{ fontSize: '16px', color: '#1d4ed8' }}>14</strong>
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: '#eefcf5', borderRadius: 'var(--radius-md)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <MessageSquare size={16} style={{ color: '#10b981' }} />
                <div>
                  <div style={{ fontSize: '10px', color: '#047857', fontWeight: 600 }}>WhatsApp</div>
                  <strong style={{ fontSize: '16px', color: '#047857' }}>8</strong>
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: '#fffbeb', borderRadius: 'var(--radius-md)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={16} style={{ color: '#d97706' }} />
                <div>
                  <div style={{ fontSize: '10px', color: '#b45309', fontWeight: 600 }}>Emails</div>
                  <strong style={{ fontSize: '16px', color: '#b45309' }}>4</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card" style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '14px' }}>Recent Activity</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {[
                { title: 'New case created', desc: 'Margaret Johnson', time: '2 min ago' },
                { title: 'Document uploaded', desc: 'Death Certificate - Williams Family', time: '15 min ago' },
                { title: 'New message received', desc: 'From Davis Family', time: '30 min ago' },
                { title: 'Payment received', desc: 'Williams Family - £2,500', time: '1 hr ago' }
              ].map((act, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{act.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{act.desc}</div>
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM LAYOUT GRID - 3 COLUMNS */}
      <div style={{ display: 'grid', gridTemplateColumns: '38% 32% 30%', gap: '20px' }}>
        {/* Case Progress Overview */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '20px' }}>Case Progress Overview</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', height: '100%', padding: '10px 0' }}>
            {/* Connection Line */}
            <div style={{ position: 'absolute', left: '10%', right: '10%', top: '35%', height: '2px', backgroundColor: 'var(--border-color)', zIndex: 1 }} />

            {[
              { step: 'First Call', val: '28' },
              { step: 'Preparation', val: '18' },
              { step: 'Viewing', val: '7' },
              { step: 'Funeral', val: '10' },
              { step: 'Aftercare', val: '12' }
            ].map((step, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 10, position: 'relative' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--bg-surface)', border: '2px solid var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: 'var(--primary-accent)' }}>
                  {step.val}
                </div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)' }}>{step.step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Overview Recharts Chart */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Revenue Overview</h3>
            <select className="input-field" style={{ width: '110px', fontSize: '11px', padding: '2px 6px' }} defaultValue="Month">
              <option value="Month">This Month</option>
              <option value="Year">This Year</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Revenue</div>
              <strong style={{ fontSize: '16px', color: 'var(--text-main)' }}>£84,000</strong>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Projected Revenue</div>
              <strong style={{ fontSize: '16px', color: 'var(--text-main)', opacity: 0.7 }}>£102,000</strong>
            </div>
          </div>

          <div style={{ flex: 1, minHeight: '100px' }}>
            <ResponsiveContainer width="100%" height={90}>
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -40, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7A9073" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#7A9073" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="revenue" stroke="#7A9073" strokeWidth={2} fillOpacity={1} fill="url(#colorRevGreen)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Staff On Duty */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Staff On Duty</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setCurrentModule('Staff')}>View All</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { name: 'James Wilson', role: 'Funeral Director' },
              { name: 'Sarah Thompson', role: 'Family Support' },
              { name: 'David Martinez', role: 'Embalmer' },
              { name: 'Lisa Brown', role: 'Administrator' }
            ].map((staff, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '11px' }}>
                    {staff.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{staff.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{staff.role}</div>
                  </div>
                </div>

                <span style={{ fontSize: '10px', color: 'var(--status-active-text)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-accent)' }} /> On Duty
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
