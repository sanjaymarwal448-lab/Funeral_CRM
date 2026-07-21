import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { CalendarEvent } from '../../types/crm';
import { CalendarEventModal } from '../modals/CalendarEventModal';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { calendarEvents, setActiveCaseId, setCurrentModule, openConfirmDialog, deleteCalendarEvent } = useCRM();

  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Calendar Bar */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>July 2026 Services Schedule</h2>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button className="btn btn-secondary btn-sm"><ChevronLeft size={14} /></button>
            <button className="btn btn-secondary btn-sm"><ChevronRight size={14} /></button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button className={`btn btn-sm ${viewMode === 'month' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('month')}>
              Month View
            </button>
            <button className={`btn btn-sm ${viewMode === 'week' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('week')}>
              Week View
            </button>
            <button className={`btn btn-sm ${viewMode === 'day' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('day')}>
              Day View
            </button>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingEvent(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={16} /> Schedule Event
          </button>
        </div>
      </div>

      {/* Calendar Grid Representation */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center', fontWeight: 700, fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
          <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
          {Array.from({ length: 31 }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `2026-07-${dayNum < 10 ? '0' + dayNum : dayNum}`;
            const eventsForDay = calendarEvents.filter(e => e.startDate === dateStr);

            return (
              <div
                key={i}
                style={{
                  minHeight: '110px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  padding: '8px',
                  backgroundColor: dayNum === 21 ? 'var(--primary-light)' : 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, color: dayNum === 21 ? 'var(--primary-accent)' : 'var(--text-muted)' }}>
                  {dayNum} {dayNum === 21 && '(Today)'}
                </div>

                {eventsForDay.map(evt => (
                  <div
                    key={evt.id}
                    style={{
                      fontSize: '11px',
                      padding: '6px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: evt.type === 'Funeral' ? '#eff6ff' : evt.type === 'Viewing' ? '#fffbe finished' : '#ecfdf5',
                      color: evt.type === 'Funeral' ? '#1d4ed8' : evt.type === 'Viewing' ? '#b45309' : '#047857',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-xs)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}
                    onClick={() => {
                      if (evt.caseId) {
                        setActiveCaseId(evt.caseId);
                        setCurrentModule('Cases');
                      }
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{evt.startTime} - {evt.type}</span>
                      <div style={{ display: 'flex', gap: '2px' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'currentColor' }}
                          onClick={() => {
                            setEditingEvent(evt);
                            setIsModalOpen(true);
                          }}
                          title="Edit Event"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#e11d48' }}
                          onClick={() => {
                            openConfirmDialog({
                              title: `Delete Event "${evt.title}"?`,
                              message: 'Are you sure you want to remove this service from the schedule?',
                              confirmText: 'Delete Event',
                              variant: 'danger',
                              onConfirm: () => deleteCalendarEvent(evt.id)
                            });
                          }}
                          title="Delete Event"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{evt.title}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <CalendarEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingEvent}
      />
    </div>
  );
};
