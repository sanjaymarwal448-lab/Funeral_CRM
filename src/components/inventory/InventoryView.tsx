import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { InventoryItem } from '../../types/crm';
import { DataTable, Column } from '../common/DataTable';
import { InventoryFormModal } from '../modals/InventoryFormModal';
import { Package, AlertTriangle, Plus, PlusCircle, MinusCircle, Edit, Trash2 } from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { inventory, adjustStock, deleteInventoryItem, openConfirmDialog } = useCRM();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const columns: Column<InventoryItem>[] = [
    {
      header: 'Item Title / Model',
      accessorKey: 'name',
      cell: (row) => <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{row.name}</span>
    },
    { header: 'Category', accessorKey: 'category' },
    {
      header: 'Stock Quantity',
      accessorKey: 'stock',
      cell: (row) => {
        const isLow = row.stock <= row.lowStockAlert;

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="btn btn-ghost btn-sm btn-icon-only" onClick={(e) => { e.stopPropagation(); adjustStock(row.id, -1); }} title="Decrease stock">
              <MinusCircle size={14} />
            </button>
            <span style={{ fontWeight: 800, fontSize: '14px', minWidth: '20px', textAlign: 'center' }}>{row.stock}</span>
            <button className="btn btn-ghost btn-sm btn-icon-only" onClick={(e) => { e.stopPropagation(); adjustStock(row.id, 1); }} title="Increase stock">
              <PlusCircle size={14} />
            </button>
            {isLow && (
              <span className="badge badge-urgent">
                <AlertTriangle size={12} /> Low Stock
              </span>
            )}
          </div>
        );
      }
    },
    { header: 'Cost Price', accessorKey: 'purchasePrice', cell: (row) => `$${row.purchasePrice}` },
    { header: 'Selling Price', accessorKey: 'sellingPrice', cell: (row) => <strong style={{ color: 'var(--text-main)' }}>${row.sellingPrice}</strong> },
    {
      header: 'Profit Margin',
      cell: (row) => {
        const margin = row.sellingPrice - row.purchasePrice;
        const pct = Math.round((margin / (row.purchasePrice || 1)) * 100);
        return <span style={{ color: '#047857', fontWeight: 700 }}>+${margin} ({pct}%)</span>;
      }
    },
    { header: 'Supplier', accessorKey: 'supplier' },
    {
      header: 'Actions',
      align: 'right',
      sortable: false,
      cell: (row) => (
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => adjustStock(row.id, 5)}
            title="Restock +5"
          >
            +5 Restock
          </button>
          <button
            className="btn btn-secondary btn-sm btn-icon-only"
            onClick={() => {
              setEditingItem(row);
              setIsModalOpen(true);
            }}
            title="Edit Item Specs"
          >
            <Edit size={14} />
          </button>
          <button
            className="btn btn-ghost btn-sm btn-icon-only"
            style={{ color: '#e11d48' }}
            onClick={() => {
              openConfirmDialog({
                title: `Delete Item "${row.name}"?`,
                message: 'Are you sure you want to remove this item from the inventory catalog?',
                confirmText: 'Delete Item',
                variant: 'danger',
                onConfirm: () => deleteInventoryItem(row.id)
              });
            }}
            title="Delete Item"
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
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Inventory & Merchandising</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Caskets, urns, embalming supplies, and tribute stationery stock</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} /> Add Inventory Item
        </button>
      </div>

      <DataTable
        data={inventory}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search casket name, category, urn, supplier..."
        bulkActions={[
          {
            label: 'Delete Selected Items',
            variant: 'danger',
            onClick: (rows) => {
              openConfirmDialog({
                title: `Delete ${rows.length} Selected Items?`,
                message: 'This will remove selected products from inventory.',
                confirmText: 'Delete All',
                variant: 'danger',
                onConfirm: () => rows.forEach(i => deleteInventoryItem(i.id))
              });
            }
          }
        ]}
      />

      <InventoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingItem}
      />
    </div>
  );
};
