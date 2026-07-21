import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { Invoice } from '../../types/crm';
import { X, Printer, Download } from 'lucide-react';

interface Props {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoicePrintModal: React.FC<Props> = ({ invoice, isOpen, onClose }) => {
  const { settings } = useCRM();

  if (!isOpen || !invoice) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '720px', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary-accent)' }}>{settings.companyName}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{settings.address} • {settings.phone}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)' }}>INVOICE</h2>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-accent)' }}>#{invoice.invoiceNumber}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Issue Date: {invoice.issueDate}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '13px' }}>
          <div>
            <strong>BILLED TO:</strong>
            <div>{invoice.familyName}</div>
            {invoice.deceasedName && <div style={{ color: 'var(--text-muted)' }}>Case Reference: {invoice.deceasedName}</div>}
          </div>
          <div>
            <strong>PAYMENT DETAILS:</strong>
            <div>Status: <span className={`badge badge-${invoice.status === 'Paid' ? 'completed' : 'scheduled'}`}>{invoice.status}</span></div>
            <div>Due Date: {invoice.dueDate}</div>
          </div>
        </div>

        <table className="crm-table" style={{ marginBottom: '24px' }}>
          <thead>
            <tr>
              <th>Description</th>
              <th style={{ textAlign: 'center' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Unit Price</th>
              <th style={{ textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map(item => (
              <tr key={item.id}>
                <td>{item.description}</td>
                <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>${item.unitPrice.toLocaleString()}</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>${item.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', fontSize: '13px', marginBottom: '24px' }}>
          <div>Subtotal: <strong>${invoice.totalAmount.toLocaleString()}</strong></div>
          <div>Paid Amount: <strong style={{ color: '#047857' }}>${invoice.paidAmount.toLocaleString()}</strong></div>
          <div style={{ fontSize: '18px', fontWeight: 800, borderTop: '2px solid var(--border-color)', paddingTop: '6px' }}>
            Balance Due: ${(invoice.totalAmount - invoice.paidAmount).toLocaleString()}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <button className="btn btn-secondary" onClick={onClose}><X size={16} /> Close</button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={() => window.print()}><Printer size={16} /> Print Statement</button>
            <button className="btn btn-primary" onClick={onClose}><Download size={16} /> Download PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
};
