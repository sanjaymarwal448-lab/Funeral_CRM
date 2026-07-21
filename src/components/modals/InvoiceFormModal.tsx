import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Invoice, InvoiceItem } from '../../types/crm';
import { X, Plus, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Invoice | null;
}

export const InvoiceFormModal: React.FC<Props> = ({ isOpen, onClose, initialData }) => {
  const { createInvoice, updateInvoice, families, cases } = useCRM();

  const [familyId, setFamilyId] = useState(families[0]?.id || '');
  const [caseId, setCaseId] = useState(cases[0]?.id || '');
  const [dueDate, setDueDate] = useState('2026-08-10');
  const [status, setStatus] = useState<Invoice['status']>('Pending');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 'item-1', description: 'Professional Director Services Package', quantity: 1, unitPrice: 3200, total: 3200 }
  ]);

  useEffect(() => {
    if (initialData) {
      setFamilyId(initialData.familyId);
      setCaseId(initialData.caseId || '');
      setDueDate(initialData.dueDate);
      setStatus(initialData.status);
      setItems(initialData.items);
    } else {
      setFamilyId(families[0]?.id || '');
      setCaseId(cases[0]?.id || '');
      setDueDate('2026-08-10');
      setStatus('Pending');
      setItems([
        { id: 'item-1', description: 'Professional Director Services Package', quantity: 1, unitPrice: 3200, total: 3200 }
      ]);
    }
  }, [initialData, isOpen, families, cases]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    const newItm: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: 'Casket or Merchandising Service',
      quantity: 1,
      unitPrice: 500,
      total: 500
    };
    setItems(prev => [...prev, newItm]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, val: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: val };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = Number(updated.quantity) * Number(updated.unitPrice);
        }
        return updated;
      }
      return item;
    }));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const family = families.find(f => f.id === familyId);
    const linkedCase = cases.find(c => c.id === caseId);

    if (!family) return;

    if (initialData) {
      updateInvoice(initialData.id, {
        familyId,
        familyName: family.name,
        caseId,
        caseNumber: linkedCase?.caseNumber,
        deceasedName: linkedCase?.deceasedName,
        items,
        totalAmount,
        dueDate,
        status
      });
    } else {
      createInvoice({
        familyId,
        familyName: family.name,
        caseId,
        caseNumber: linkedCase?.caseNumber,
        deceasedName: linkedCase?.deceasedName,
        items,
        totalAmount,
        paidAmount: status === 'Paid' ? totalAmount : 0,
        dueDate,
        issueDate: new Date().toISOString().split('T')[0],
        status
      });
    }
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '650px' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-subtle)' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700 }}>{initialData ? 'Edit Invoice' : 'Generate New Client Invoice'}</h3>
          <button className="btn btn-ghost btn-icon-only" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="input-group">
              <label className="input-label">Billed Family Contact *</label>
              <select className="input-field" value={familyId} onChange={(e) => setFamilyId(e.target.value)}>
                {families.map(f => (
                  <option key={f.id} value={f.id}>{f.name} ({f.relationship})</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Linked Deceased Case</label>
              <select className="input-field" value={caseId} onChange={(e) => setCaseId(e.target.value)}>
                {cases.map(c => (
                  <option key={c.id} value={c.id}>{c.caseNumber} - {c.deceasedName}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="input-group">
              <label className="input-label">Due Date</label>
              <input
                type="date"
                className="input-field"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Payment Status</label>
              <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Itemized Lines */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Itemized Fee Breakdown</h4>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddItem}>
                <Plus size={14} /> Add Line Item
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 80px 100px 100px 32px', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                  />
                  <input
                    type="number"
                    className="input-field"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                  />
                  <input
                    type="number"
                    className="input-field"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                  />
                  <div style={{ fontWeight: 700, fontSize: '13px', textAlign: 'right' }}>
                    ${item.total.toLocaleString()}
                  </div>
                  {items.length > 1 && (
                    <button type="button" className="btn btn-ghost btn-icon-only" style={{ color: '#e11d48' }} onClick={() => handleRemoveItem(item.id)}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-subtle)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Total Billed Amount:</span>
            <strong style={{ fontSize: '20px', color: 'var(--text-main)' }}>${totalAmount.toLocaleString()}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{initialData ? 'Save Changes' : 'Generate Invoice'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
