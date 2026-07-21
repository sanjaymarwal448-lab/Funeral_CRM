import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { CaseDocument } from '../../types/crm';
import { DocumentUploadModal } from '../modals/DocumentUploadModal';
import { DocumentPreviewModal } from '../modals/DocumentPreviewModal';
import { FileText, Folder, Upload, Download, Trash2, Edit2, Eye } from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { documents, renameDocument, deleteDocument, searchQuery, openConfirmDialog } = useCRM();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<CaseDocument | null>(null);

  const [renamingDocId, setRenamingDocId] = useState<string | null>(null);
  const [newDocTitle, setNewDocTitle] = useState('');

  const categories = ['ALL', 'Death Certificates', 'Contracts', 'Invoices', 'Photos', 'IDs', 'Other Files'];

  const filteredDocs = documents.filter(d => {
    const matchesCat = activeCategory === 'ALL' || d.category === activeCategory;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || (d.caseName && d.caseName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleRenameSubmit = (id: string) => {
    if (!newDocTitle) return;
    renameDocument(id, newDocTitle.endsWith('.pdf') ? newDocTitle : `${newDocTitle}.pdf`);
    setRenamingDocId(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Document Repository & Vault</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Secure archival for vital records, contracts, certificates & family photos</p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
          <Upload size={16} /> Upload Document
        </button>
      </div>

      {/* Folder Categories Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveCategory(cat)}
            style={{ fontSize: '12px' }}
          >
            <Folder size={14} /> {cat}
          </button>
        ))}
      </div>

      {/* Document Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filteredDocs.map(doc => (
          <div key={doc.id} className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={20} />
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                {renamingDocId === doc.id ? (
                  <input
                    type="text"
                    className="input-field"
                    autoFocus
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    onBlur={() => handleRenameSubmit(doc.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit(doc.id)}
                    style={{ padding: '4px 8px', fontSize: '12px' }}
                  />
                ) : (
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {doc.name}
                  </div>
                )}
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {doc.category} • {doc.size}
                </div>
              </div>
            </div>

            {doc.caseName && (
              <div style={{ fontSize: '11px', color: 'var(--primary-accent)', backgroundColor: 'var(--bg-subtle)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>
                Case: {doc.caseName}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>Uploaded {doc.uploadDate}</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn btn-ghost btn-sm btn-icon-only" onClick={() => setPreviewDoc(doc)} title="Preview File">
                  <Eye size={14} />
                </button>
                <button
                  className="btn btn-ghost btn-sm btn-icon-only"
                  onClick={() => {
                    setRenamingDocId(doc.id);
                    setNewDocTitle(doc.name);
                  }}
                  title="Rename File"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  className="btn btn-ghost btn-sm btn-icon-only"
                  style={{ color: '#e11d48' }}
                  onClick={() => {
                    openConfirmDialog({
                      title: `Delete Document "${doc.name}"?`,
                      message: 'Are you sure you want to permanently delete this document?',
                      confirmText: 'Delete File',
                      variant: 'danger',
                      onConfirm: () => deleteDocument(doc.id)
                    });
                  }}
                  title="Delete File"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DocumentUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />

      <DocumentPreviewModal
        doc={previewDoc}
        isOpen={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
};
