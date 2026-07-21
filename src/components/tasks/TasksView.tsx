import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { CaseTask } from '../../types/crm';
import { DataTable, Column } from '../common/DataTable';
import { Plus, LayoutGrid, List, Edit, Trash2, CheckCircle2 } from 'lucide-react';

export const TasksView: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus, moveTaskStatus, openConfirmDialog, cases, staff } = useCRM();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<CaseTask | null>(null);

  const [title, setTitle] = useState('');
  const [assignedStaffName, setAssignedStaffName] = useState(staff[0]?.name || 'Marcus Vance');
  const [priority, setPriority] = useState<CaseTask['priority']>('Medium');
  const [caseId, setCaseId] = useState('');
  const [dueDate, setDueDate] = useState('2026-07-25');
  const [dueTime, setDueTime] = useState('02:00 PM');

  const openAddModal = () => {
    setEditingTask(null);
    setTitle('');
    setAssignedStaffName(staff[0]?.name || 'Marcus Vance');
    setPriority('Medium');
    setCaseId('');
    setShowModal(true);
  };

  const openEditModal = (t: CaseTask) => {
    setEditingTask(t);
    setTitle(t.title);
    setAssignedStaffName(t.assignedStaffName);
    setPriority(t.priority);
    setCaseId(t.caseId || '');
    setDueDate(t.dueDate);
    setDueTime(t.dueTime);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const linkedCase = cases.find(c => c.id === caseId);

    if (editingTask) {
      updateTask(editingTask.id, {
        title,
        assignedStaffName,
        priority,
        caseId,
        caseName: linkedCase?.deceasedName,
        dueDate,
        dueTime
      });
    } else {
      addTask({
        title,
        assignedStaffName,
        priority,
        status: 'To Do',
        caseId,
        caseName: linkedCase?.deceasedName,
        dueDate,
        dueTime
      });
    }

    setShowModal(false);
  };

  const columns: ('To Do' | 'In Progress' | 'Completed')[] = ['To Do', 'In Progress', 'Completed'];

  const tableColumns: Column<CaseTask>[] = [
    {
      header: 'Done',
      cell: (row) => (
        <input
          type="checkbox"
          checked={row.status === 'Completed'}
          onChange={() => toggleTaskStatus(row.id)}
        />
      ),
      width: '40px'
    },
    {
      header: 'Task Title',
      accessorKey: 'title',
      cell: (row) => (
        <span style={{ fontWeight: 600, textDecoration: row.status === 'Completed' ? 'line-through' : 'none', color: row.status === 'Completed' ? 'var(--text-subtle)' : 'var(--text-main)' }}>
          {row.title}
        </span>
      )
    },
    { header: 'Linked Case', accessorKey: 'caseName', cell: (row) => row.caseName || 'General Operation' },
    { header: 'Assigned Staff', accessorKey: 'assignedStaffName' },
    { header: 'Due Date & Time', cell: (row) => `${row.dueDate} at ${row.dueTime}` },
    {
      header: 'Priority',
      accessorKey: 'priority',
      cell: (row) => (
        <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', backgroundColor: row.priority === 'High' ? '#fff1f2' : '#eff6ff', color: row.priority === 'High' ? '#e11d48' : '#2563eb' }}>
          {row.priority}
        </span>
      )
    },
    {
      header: 'Actions',
      align: 'right',
      sortable: false,
      cell: (row) => (
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary btn-sm btn-icon-only" onClick={() => openEditModal(row)} title="Edit Task">
            <Edit size={14} />
          </button>
          <button
            className="btn btn-ghost btn-sm btn-icon-only"
            style={{ color: '#e11d48' }}
            onClick={() => {
              openConfirmDialog({
                title: `Delete Task "${row.title}"?`,
                message: 'Are you sure you want to remove this task?',
                confirmText: 'Delete Task',
                variant: 'danger',
                onConfirm: () => deleteTask(row.id)
              });
            }}
            title="Delete Task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Task Management & Operational Checklists</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Track director assignments, permits, and floral preparation</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button className={`btn btn-sm ${viewMode === 'kanban' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('kanban')}>
              <LayoutGrid size={14} /> Kanban
            </button>
            <button className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('list')}>
              <List size={14} /> List View
            </button>
          </div>

          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '450px' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', fontWeight: 700 }}>
              {editingTask ? 'Edit Operational Task' : 'Create Operational Task'}
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="input-group">
                <label className="input-label">Task Description *</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder="e.g. Order Mahogany Casket from Supplier"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Linked Case (Optional)</label>
                <select className="input-field" value={caseId} onChange={(e) => setCaseId(e.target.value)}>
                  <option value="">-- General Task --</option>
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>{c.caseNumber} - {c.deceasedName}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Assigned Staff</label>
                <select className="input-field" value={assignedStaffName} onChange={(e) => setAssignedStaffName(e.target.value)}>
                  {staff.map(s => (
                    <option key={s.id} value={s.name}>{s.name} ({s.position})</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Priority Level</label>
                <select className="input-field" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingTask ? 'Save Changes' : 'Create Task'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KANBAN BOARD */}
      {viewMode === 'kanban' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {columns.map(col => {
            const colTasks = tasks.filter(t => t.status === col);

            return (
              <div key={col} style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>{col}</h3>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                    {colTasks.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {colTasks.map(t => (
                    <div key={t.id} className="card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-main)' }}>{t.title}</div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button className="btn btn-ghost btn-sm btn-icon-only" onClick={() => openEditModal(t)} title="Edit Task">
                            <Edit size={12} />
                          </button>
                          <button className="btn btn-ghost btn-sm btn-icon-only" style={{ color: '#e11d48' }} onClick={() => deleteTask(t.id)} title="Delete Task">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {t.caseName && (
                        <div style={{ fontSize: '11px', color: 'var(--primary-accent)', fontWeight: 500 }}>
                          Case: {t.caseName}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <span>👤 {t.assignedStaffName}</span>
                        <span style={{ color: t.priority === 'High' ? '#e11d48' : '#2563eb', fontWeight: 700 }}>{t.priority}</span>
                      </div>

                      {/* Kanban Column Movement Actions */}
                      <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                        {col !== 'To Do' && (
                          <button className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: '10px' }} onClick={() => moveTaskStatus(t.id, col === 'Completed' ? 'In Progress' : 'To Do')}>
                            ← Move Left
                          </button>
                        )}
                        {col !== 'Completed' && (
                          <button className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: '10px' }} onClick={() => moveTaskStatus(t.id, col === 'To Do' ? 'In Progress' : 'Completed')}>
                            Move Right →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <DataTable
          data={tasks}
          columns={tableColumns}
          keyExtractor={(t) => t.id}
          searchPlaceholder="Search operational tasks..."
        />
      )}
    </div>
  );
};
