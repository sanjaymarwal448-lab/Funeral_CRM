import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Family } from '../../types/crm';
import { DataTable, Column } from '../common/DataTable';
import { FamilyFormModal } from '../modals/FamilyFormModal';
import { Plus, Phone, Mail, ExternalLink, Edit, Trash2 } from 'lucide-react';

export const FamiliesView: React.FC = () => {
  const { families, setDrawerItem, setActiveCaseId, setCurrentModule, openConfirmDialog, deleteFamily } = useCRM();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);

  const columns: Column<Family>[] = [
    {
      header: 'Family Contact Name',
      accessorKey: 'name',
      cell: (row) => <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{row.name}</span>
    },
    { header: 'Relationship', accessorKey: 'relationship' },
    {
      header: 'Phone',
      accessorKey: 'phone',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Phone size={14} style={{ color: 'var(--text-subtle)' }} /> {row.phone}
        </div>
      )
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Mail size={14} style={{ color: 'var(--text-subtle)' }} /> {row.email}
        </div>
      )
    },
    {
      header: 'Linked Deceased Cases',
      cell: (row) => (
        <div>
          {row.linkedCases.length === 0 ? (
            <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>None</span>
          ) : (
            row.linkedCases.map(lc => (
              <span
                key={lc.caseId}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary-accent)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  marginRight: '6px',
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCaseId(lc.caseId);
                  setCurrentModule('Cases');
                }}
              >
                {lc.deceasedName} <ExternalLink size={10} />
              </span>
            ))
          )}
        </div>
      )
    },
    { header: 'Last Activity', accessorKey: 'lastActivity' },
    {
      header: 'Actions',
      align: 'right',
      sortable: false,
      cell: (row) => (
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
          <button
            className="btn btn-secondary btn-sm btn-icon-only"
            onClick={() => {
              setEditingFamily(row);
              setIsModalOpen(true);
            }}
            title="Edit Family Record"
          >
            <Edit size={14} />
          </button>
          <button
            className="btn btn-ghost btn-sm btn-icon-only"
            style={{ color: '#e11d48' }}
            onClick={() => {
              openConfirmDialog({
                title: `Delete Family Record for ${row.name}?`,
                message: `Are you sure you want to remove ${row.name}? This will unlink them from historical cases.`,
                confirmText: 'Delete Record',
                variant: 'danger',
                onConfirm: () => deleteFamily(row.id)
              });
            }}
            title="Delete Family Record"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Families Directory (CRM)</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Manage next-of-kin contacts, address records, and historical arrangements</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingFamily(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} /> Register Family Contact
        </button>
      </div>

      <DataTable
        data={families}
        columns={columns}
        keyExtractor={(f) => f.id}
        onRowClick={(f) => setDrawerItem({ type: 'family', id: f.id })}
        searchPlaceholder="Search family name, phone, email, address..."
        bulkActions={[
          {
            label: 'Delete Selected Families',
            variant: 'danger',
            onClick: (rows) => {
              openConfirmDialog({
                title: `Delete ${rows.length} Selected Families?`,
                message: `This will permanently remove ${rows.length} family profiles.`,
                confirmText: 'Delete All',
                variant: 'danger',
                onConfirm: () => rows.forEach(f => deleteFamily(f.id))
              });
            }
          }
        ]}
      />

      <FamilyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingFamily}
      />
    </div>
  );
};
