import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Invoice } from '../../types/crm';
import { DataTable, Column } from '../common/DataTable';
import { InvoiceFormModal } from '../modals/InvoiceFormModal';
import { InvoicePrintModal } from '../modals/InvoicePrintModal';
import { Plus, Eye, Printer, Edit, Trash2, CheckCircle2 } from 'lucide-react';

export const InvoicesView: React.FC = () => {
  const { invoices, markInvoiceStatus, deleteInvoice, setDrawerItem, openConfirmDialog } = useCRM();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);

  const paidTotal = invoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.totalAmount, 0);
  const pendingTotal = invoices.filter(i => i.status === 'Pending').reduce((acc, i) => acc + i.totalAmount, 0);
  const overdueTotal = invoices.filter(i => i.status === 'Overdue').reduce((acc, i) => acc + i.totalAmount, 0);
  const grandTotal = paidTotal + pendingTotal + overdueTotal;

  const columns: Column<Invoice>[] = [
    {
      header: 'Invoice #',
      accessorKey: 'invoiceNumber',
      cell: (row) => <span style={{ fontWeight: 700, color: 'var(--primary-accent)' }}>{row.invoiceNumber}</span>
    },
    {
      header: 'Billed Family',
      accessorKey: 'familyName',
      cell: (row) => <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{row.familyName}</span>
    },
    { header: 'Deceased Reference', accessorKey: 'deceasedName', cell: (row) => row.deceasedName || 'Direct Billing' },
    { header: 'Issue Date', accessorKey: 'issueDate' },
    { header: 'Due Date', accessorKey: 'dueDate' },
    {
      header: 'Total Amount',
      accessorKey: 'totalAmount',
      cell: (row) => <span style={{ fontWeight: 700, fontSize: '14px' }}>${row.totalAmount.toLocaleString()}</span>
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <span className={`badge badge-${row.status === 'Paid' ? 'completed' : row.status === 'Pending' ? 'scheduled' : 'urgent'}`}>
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
          {row.status !== 'Paid' && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => markInvoiceStatus(row.id, 'Paid')}
              title="Mark Paid"
            >
              <CheckCircle2 size={12} /> Mark Paid
            </button>
          )}
          <button
            className="btn btn-secondary btn-sm btn-icon-only"
            onClick={() => setPrintInvoice(row)}
            title="Print Statement / Receipt"
          >
            <Printer size={14} />
          </button>
          <button
            className="btn btn-secondary btn-sm btn-icon-only"
            onClick={() => {
              setEditingInvoice(row);
              setIsFormModalOpen(true);
            }}
            title="Edit Invoice"
          >
            <Edit size={14} />
          </button>
          <button
            className="btn btn-ghost btn-sm btn-icon-only"
            style={{ color: '#e11d48' }}
            onClick={() => {
              openConfirmDialog({
                title: `Delete Invoice #${row.invoiceNumber}?`,
                message: `Are you sure you want to remove this invoice statement?`,
                confirmText: 'Delete Invoice',
                variant: 'danger',
                onConfirm: () => deleteInvoice(row.id)
              });
            }}
            title="Delete Invoice"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Financial Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Paid Revenue</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#047857', marginTop: '6px' }}>
            ${paidTotal.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '4px' }}>Cleared funds</div>
        </div>

        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Payments</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#2563eb', marginTop: '6px' }}>
            ${pendingTotal.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '4px' }}>Awaiting settlement</div>
        </div>

        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Overdue Invoices</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#e11d48', marginTop: '6px' }}>
            ${overdueTotal.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#e11d48', marginTop: '4px', fontWeight: 600 }}>Action required</div>
        </div>

        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Gross Billed Value</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginTop: '6px' }}>
            ${grandTotal.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '4px' }}>Total invoicing</div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Invoices & Financial Accounts</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Manage client invoicing, deposits, balances, and payment statements</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingInvoice(null);
            setIsFormModalOpen(true);
          }}
        >
          <Plus size={16} /> Create Invoice
        </button>
      </div>

      <DataTable
        data={invoices}
        columns={columns}
        keyExtractor={(inv) => inv.id}
        onRowClick={(inv) => setDrawerItem({ type: 'invoice', id: inv.id })}
        searchPlaceholder="Search invoice #, family name, deceased reference..."
        bulkActions={[
          {
            label: 'Mark Paid',
            onClick: (rows) => rows.forEach(inv => markInvoiceStatus(inv.id, 'Paid'))
          },
          {
            label: 'Delete Selected',
            variant: 'danger',
            onClick: (rows) => {
              openConfirmDialog({
                title: `Delete ${rows.length} Selected Invoices?`,
                message: 'Are you sure you want to permanently erase these invoice statements?',
                confirmText: 'Delete All',
                variant: 'danger',
                onConfirm: () => rows.forEach(inv => deleteInvoice(inv.id))
              });
            }
          }
        ]}
      />

      <InvoiceFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialData={editingInvoice}
      />

      <InvoicePrintModal
        invoice={printInvoice}
        isOpen={Boolean(printInvoice)}
        onClose={() => setPrintInvoice(null)}
      />
    </div>
  );
};
