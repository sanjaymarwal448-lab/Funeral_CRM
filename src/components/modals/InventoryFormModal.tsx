import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { InventoryItem } from '../../types/crm';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: InventoryItem | null;
}

export const InventoryFormModal: React.FC<Props> = ({ isOpen, onClose, initialData }) => {
  const { addInventoryItem, updateInventoryItem } = useCRM();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryItem['category']>('Caskets');
  const [stock, setStock] = useState(5);
  const [lowStockAlert, setLowStockAlert] = useState(2);
  const [purchasePrice, setPurchasePrice] = useState(1500);
  const [sellingPrice, setSellingPrice] = useState(3200);
  const [supplier, setSupplier] = useState('');
  const [location, setLocation] = useState('Main Warehouse');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setStock(initialData.stock);
      setLowStockAlert(initialData.lowStockAlert);
      setPurchasePrice(initialData.purchasePrice);
      setSellingPrice(initialData.sellingPrice);
      setSupplier(initialData.supplier);
      setLocation(initialData.location);
    } else {
      setName('');
      setCategory('Caskets');
      setStock(5);
      setLowStockAlert(2);
      setPurchasePrice(1500);
      setSellingPrice(3200);
      setSupplier('');
      setLocation('Main Warehouse');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (initialData) {
      updateInventoryItem(initialData.id, {
        name,
        category,
        stock: Number(stock),
        lowStockAlert: Number(lowStockAlert),
        purchasePrice: Number(purchasePrice),
        sellingPrice: Number(sellingPrice),
        supplier,
        location
      });
    } else {
      addInventoryItem({
        name,
        category,
        stock: Number(stock),
        lowStockAlert: Number(lowStockAlert),
        purchasePrice: Number(purchasePrice),
        sellingPrice: Number(sellingPrice),
        supplier: supplier || 'Standard Distributor',
        location
      });
    }
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '520px' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-subtle)' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700 }}>{initialData ? 'Edit Inventory Record' : 'Add Inventory Item'}</h3>
          <button className="btn btn-ghost btn-icon-only" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="input-group">
            <label className="input-label">Item Title / Model Name *</label>
            <input
              type="text"
              className="input-field"
              required
              placeholder="e.g. Heritage Solid Mahogany Casket"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="input-group">
              <label className="input-label">Category</label>
              <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value as any)}>
                <option value="Caskets">Caskets</option>
                <option value="Urns">Urns</option>
                <option value="Flowers">Flowers</option>
                <option value="Stationery">Stationery</option>
                <option value="Embalming Supplies">Embalming Supplies</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Supplier Company</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Batesville Casket Co."
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="input-group">
              <label className="input-label">Initial Stock Quantity</label>
              <input
                type="number"
                className="input-field"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Low Stock Warning Threshold</label>
              <input
                type="number"
                className="input-field"
                value={lowStockAlert}
                onChange={(e) => setLowStockAlert(Number(e.target.value))}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="input-group">
              <label className="input-label">Wholesale Cost Price ($)</label>
              <input
                type="number"
                className="input-field"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Retail Selling Price ($)</label>
              <input
                type="number"
                className="input-field"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{initialData ? 'Save Changes' : 'Add Item'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
