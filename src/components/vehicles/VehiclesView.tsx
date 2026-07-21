import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Vehicle } from '../../types/crm';
import { VehicleFormModal } from '../modals/VehicleFormModal';
import { Truck, Calendar, User, Wrench, Plus, Edit, Trash2 } from 'lucide-react';

export const VehiclesView: React.FC = () => {
  const { vehicles, updateVehicle, deleteVehicle, openConfirmDialog } = useCRM();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const toggleStatus = (v: Vehicle) => {
    const nextStatus = v.status === 'Available' ? 'In Service' : v.status === 'In Service' ? 'Maintenance' : 'Available';
    updateVehicle(v.id, { status: nextStatus });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Fleet Management & Logistics</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Hearses, presidential limousines & first-call transfer vehicles</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingVehicle(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} /> Register Vehicle
        </button>
      </div>

      {/* Fleet Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {vehicles.map(v => (
          <div key={v.id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '180px', width: '100%', overflow: 'hidden', position: 'relative' }}>
              <img
                src={v.photo}
                alt={v.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span
                className={`badge badge-${v.status === 'Available' ? 'active' : v.status === 'In Service' ? 'scheduled' : 'urgent'}`}
                style={{ position: 'absolute', top: '12px', right: '12px', backdropFilter: 'blur(4px)', cursor: 'pointer' }}
                onClick={() => toggleStatus(v)}
                title="Click to toggle operational status"
              >
                <span className="badge-dot" /> {v.status}
              </span>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-accent)' }}>
                    {v.type}
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                    {v.name}
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    className="btn btn-secondary btn-sm btn-icon-only"
                    onClick={() => {
                      setEditingVehicle(v);
                      setIsModalOpen(true);
                    }}
                    title="Edit Vehicle"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    className="btn btn-ghost btn-sm btn-icon-only"
                    style={{ color: '#e11d48' }}
                    onClick={() => {
                      openConfirmDialog({
                        title: `Delete Vehicle "${v.name}"?`,
                        message: 'Are you sure you want to remove this vehicle from the fleet?',
                        confirmText: 'Delete Vehicle',
                        variant: 'danger',
                        onConfirm: () => deleteVehicle(v.id)
                      });
                    }}
                    title="Delete Vehicle"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', color: 'var(--text-body)' }}>
                <div><strong>Reg #:</strong> {v.registrationNumber}</div>
                <div><strong>Mileage:</strong> {v.mileage}</div>
                <div><strong>Assigned Driver:</strong> {v.driverName}</div>
                <div><strong>Next Service:</strong> {v.nextMaintenanceDate}</div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => toggleStatus(v)}>
                  <Wrench size={14} /> Toggle Status
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setEditingVehicle(v);
                    setIsModalOpen(true);
                  }}
                >
                  Edit Driver & Specs
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <VehicleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingVehicle}
      />
    </div>
  );
};
