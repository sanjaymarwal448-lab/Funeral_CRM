import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { X, Calendar, Phone, Mail, MapPin, User } from 'lucide-react';

export const DetailDrawer: React.FC = () => {
  const { drawerItem, setDrawerItem, cases, families, invoices, vehicles, staff, setActiveCaseId, setCurrentModule } = useCRM();

  if (!drawerItem) return null;

  const handleClose = () => setDrawerItem(null);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active': return 'badge-active';
      case 'Service Scheduled': return 'badge-scheduled';
      case 'In Transit': return 'badge-transit';
      case 'Completed': return 'badge-completed';
      default: return 'badge-scheduled';
    }
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={handleClose} />
      <div className="drawer-content">
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-subtle)'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--primary-accent)'
              }}
            >
              {drawerItem.type.toUpperCase()} QUICK VIEW
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '2px' }}>
              {drawerItem.type === 'case' && cases.find(c => c.id === drawerItem.id)?.deceasedName}
              {drawerItem.type === 'family' && families.find(f => f.id === drawerItem.id)?.name}
              {drawerItem.type === 'invoice' && invoices.find(i => i.id === drawerItem.id)?.invoiceNumber}
              {drawerItem.type === 'vehicle' && vehicles.find(v => v.id === drawerItem.id)?.name}
              {drawerItem.type === 'staff' && staff.find(s => s.id === drawerItem.id)?.name}
            </h3>
          </div>

          <button className="btn btn-ghost btn-icon-only" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {/* CASE DRAWER DETAIL */}
          {drawerItem.type === 'case' && (() => {
            const caseData = cases.find(c => c.id === drawerItem.id);
            if (!caseData) return <div>Case not found</div>;

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="card" style={{ padding: '16px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Case Number</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{caseData.caseNumber}</div>
                  <div style={{ marginTop: '8px' }}>
                    <span className={`badge ${getStatusBadgeClass(caseData.status)}`}>
                      <span className="badge-dot" /> {caseData.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 style={{ marginBottom: '12px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Deceased Details</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    <div><strong>Date of Birth:</strong> {caseData.dateOfBirth}</div>
                    <div><strong>Date of Death:</strong> {caseData.dateOfDeath}</div>
                    <div><strong>Place of Death:</strong> {caseData.placeOfDeath}</div>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

                <div>
                  <h4 style={{ marginBottom: '12px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Primary Contact</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={14} /> {caseData.primaryContactName} ({caseData.relationship})</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} /> {caseData.phone}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} /> {caseData.email}</div>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

                <div>
                  <h4 style={{ marginBottom: '12px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Service Arrangement</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    <div><strong>Service Type:</strong> {caseData.serviceType}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={14} /> {caseData.funeralDate} at {caseData.funeralTime}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} /> {caseData.location}</div>
                    <div><strong>Assigned Director:</strong> {caseData.assignedStaffName}</div>
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => {
                      setActiveCaseId(caseData.id);
                      setCurrentModule('Cases');
                      handleClose();
                    }}
                  >
                    Open Full Case File
                  </button>
                </div>
              </div>
            );
          })()}

          {/* FAMILY DRAWER DETAIL */}
          {drawerItem.type === 'family' && (() => {
            const family = families.find(f => f.id === drawerItem.id);
            if (!family) return <div>Family profile not found</div>;

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px' }}>
                    {family.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px' }}>{family.name}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{family.relationship}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} /> {family.phone}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} /> {family.email}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} /> {family.address}</div>
                </div>

                <div>
                  <h4 style={{ marginBottom: '8px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Linked Deceased Cases</h4>
                  {family.linkedCases.map(lc => (
                    <div key={lc.caseId} className="card" style={{ padding: '12px', marginBottom: '8px', cursor: 'pointer' }} onClick={() => {
                      setActiveCaseId(lc.caseId);
                      setCurrentModule('Cases');
                      handleClose();
                    }}>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{lc.deceasedName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lc.caseNumber}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* INVOICE DRAWER DETAIL */}
          {drawerItem.type === 'invoice' && (() => {
            const invoice = invoices.find(i => i.id === drawerItem.id);
            if (!invoice) return <div>Invoice not found</div>;

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Billed To</div>
                    <div style={{ fontWeight: 700 }}>{invoice.familyName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Case: {invoice.deceasedName}</div>
                  </div>
                  <span className={`badge ${invoice.status === 'Paid' ? 'badge-completed' : invoice.status === 'Pending' ? 'badge-scheduled' : 'badge-urgent'}`}>
                    {invoice.status}
                  </span>
                </div>

                <div className="card" style={{ padding: '16px', background: 'var(--bg-subtle)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Amount</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>${invoice.totalAmount.toLocaleString()}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Paid: ${invoice.paidAmount.toLocaleString()} | Due: ${ (invoice.totalAmount - invoice.paidAmount).toLocaleString() }</div>
                </div>

                <div>
                  <h4 style={{ marginBottom: '8px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Itemized Breakdown</h4>
                  <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    {invoice.items.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid var(--border-light)', fontSize: '12px' }}>
                        <div>{item.description} (x{item.quantity})</div>
                        <div style={{ fontWeight: 600 }}>${item.total.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
};
