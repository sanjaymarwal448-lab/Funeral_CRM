import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { StaffMember } from '../../types/crm';
import { StaffFormModal } from '../modals/StaffFormModal';
import { Mail, Phone, Plus, FolderKanban, Edit, Trash2, Power } from 'lucide-react';

export const StaffView: React.FC = () => {
  const { staff, toggleStaffStatus, deleteStaff, openConfirmDialog } = useCRM();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Staff Directory & Roles</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Directors, arrangement counselors, transport specialists & morticians</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingStaff(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} /> Add Team Member
        </button>
      </div>

      {/* Staff Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {staff.map(member => (
          <div key={member.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-accent)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '16px'
                  }}
                >
                  {member.photo}
                </div>

                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>{member.name}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{member.position}</div>
                  <span className="badge badge-scheduled" style={{ marginTop: '4px', fontSize: '10px' }}>
                    {member.role}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  className="btn btn-secondary btn-sm btn-icon-only"
                  onClick={() => {
                    setEditingStaff(member);
                    setIsModalOpen(true);
                  }}
                  title="Edit Profile"
                >
                  <Edit size={14} />
                </button>
                <button
                  className="btn btn-ghost btn-sm btn-icon-only"
                  style={{ color: '#e11d48' }}
                  onClick={() => {
                    openConfirmDialog({
                      title: `Delete Staff Member "${member.name}"?`,
                      message: 'Are you sure you want to remove this employee from the directory?',
                      confirmText: 'Delete Employee',
                      variant: 'danger',
                      onConfirm: () => deleteStaff(member.id)
                    });
                  }}
                  title="Delete Member"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-body)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} style={{ color: 'var(--text-subtle)' }} /> {member.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} style={{ color: 'var(--text-subtle)' }} /> {member.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderKanban size={14} style={{ color: 'var(--text-subtle)' }} /> {member.activeCasesCount} Active Assigned Cases
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
              <span className={`badge badge-${member.status === 'Active' ? 'active' : 'transit'}`}>
                <span className="badge-dot" /> {member.status}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => toggleStaffStatus(member.id)}
              >
                <Power size={12} /> {member.status === 'Active' ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <StaffFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingStaff}
      />
    </div>
  );
};
