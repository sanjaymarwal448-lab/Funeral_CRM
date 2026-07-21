import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { CaseDetailPage } from './CaseDetailPage';
import { DataTable, Column } from '../common/DataTable';
import { Case } from '../../types/crm';
import { Plus, Eye, Copy, Archive, Trash2, Edit } from 'lucide-react';
import { CreateCaseModal } from '../modals/CreateCaseModal';

export const CasesView: React.FC = () => {
  const { cases, activeCaseId, setActiveCaseId, setIsCreateCaseModalOpen, duplicateCase, archiveCase, openConfirmDialog, deleteCase } = useCRM();

  const [editingCase, setEditingCase] = useState<Case | null>(null);

  if (activeCaseId) {
    return <CaseDetailPage caseId={activeCaseId} onBack={() => setActiveCaseId(null)} />;
  }

  const columns: Column<Case>[] = [
    {
      header: 'Case Number',
      accessorKey: 'caseNumber',
      cell: (row) => <span style={{ fontWeight: 700, color: 'var(--primary-accent)' }}>{row.caseNumber}</span>
    },
    {
      header: 'Deceased Name',
      accessorKey: 'deceasedName',
      cell: (row) => <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{row.deceasedName}</span>
    },
    {
      header: 'Primary Contact',
      accessorKey: 'primaryContactName',
      cell: (row) => (
        <div>
          <div>{row.primaryContactName}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.relationship}</div>
        </div>
      )
    },
    { header: 'Service Type', accessorKey: 'serviceType' },
    { header: 'Funeral Date', accessorKey: 'funeralDate' },
    { header: 'Assigned Director', accessorKey: 'assignedStaffName' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <span className={`badge badge-${row.status === 'Active' ? 'active' : row.status === 'Service Scheduled' ? 'scheduled' : row.status === 'In Transit' ? 'transit' : 'completed'}`}>
          <span className="badge-dot" /> {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      align: 'right',
      sortable: false,
      cell: (row) => (
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
          <button className="btn btn-secondary btn-sm btn-icon-only" onClick={() => setActiveCaseId(row.id)} title="Open Case File">
            <Eye size={14} />
          </button>
          <button className="btn btn-secondary btn-sm btn-icon-only" onClick={() => duplicateCase(row.id)} title="Duplicate Case">
            <Copy size={14} />
          </button>
          <button className="btn btn-secondary btn-sm btn-icon-only" onClick={() => archiveCase(row.id)} title="Archive Case">
            <Archive size={14} />
          </button>
          <button
            className="btn btn-ghost btn-sm btn-icon-only"
            style={{ color: '#e11d48' }}
            onClick={() => {
              openConfirmDialog({
                title: `Delete Case #${row.caseNumber}?`,
                message: `Are you sure you want to delete the case file for ${row.deceasedName}? This will remove associated tasks, documents, and records.`,
                confirmText: 'Delete Case',
                variant: 'danger',
                onConfirm: () => deleteCase(row.id)
              });
            }}
            title="Delete Case"
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
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Funeral Cases Registry</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Complete database of first call logs, active arrangements & completed services</p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsCreateCaseModalOpen(true)}>
          <Plus size={16} /> New Case File
        </button>
      </div>

      <DataTable
        data={cases}
        columns={columns}
        keyExtractor={(item) => item.id}
        onRowClick={(item) => setActiveCaseId(item.id)}
        searchPlaceholder="Search deceased name, case #, family contact, director..."
        bulkActions={[
          {
            label: 'Archive Selected',
            onClick: (rows) => rows.forEach(r => archiveCase(r.id))
          },
          {
            label: 'Delete Selected',
            variant: 'danger',
            onClick: (rows) => {
              openConfirmDialog({
                title: `Delete ${rows.length} Selected Cases?`,
                message: `This will permanently erase ${rows.length} case files and their associated records.`,
                confirmText: 'Delete All',
                variant: 'danger',
                onConfirm: () => rows.forEach(r => deleteCase(r.id))
              });
            }
          }
        ]}
      />
    </div>
  );
};
