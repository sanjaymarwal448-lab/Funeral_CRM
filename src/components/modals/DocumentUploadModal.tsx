import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { X, Upload, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentUploadModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addDocument, cases } = useCRM();

  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState<'Death Certificates' | 'Contracts' | 'Invoices' | 'Photos' | 'IDs' | 'Other Files'>('Death Certificates');
  const [caseId, setCaseId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) return;

    setIsUploading(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          const linkedCase = cases.find(c => c.id === caseId);

          addDocument({
            name: docName.endsWith('.pdf') || docName.endsWith('.png') ? docName : `${docName}.pdf`,
            category,
            caseId: caseId || undefined,
            caseName: linkedCase?.deceasedName,
            size: '2.4 MB',
            uploadDate: new Date().toISOString().split('T')[0],
            fileType: 'pdf'
          });

          setIsUploading(false);
          setUploadProgress(0);
          setDocName('');
          onClose();
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '500px' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-subtle)' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700 }}>Upload File to Document Storage Vault</h3>
          <button className="btn btn-ghost btn-icon-only" onClick={onClose} disabled={isUploading}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ border: '2px dashed var(--primary-accent)', borderRadius: 'var(--radius-lg)', padding: '24px', textAlign: 'center', backgroundColor: 'var(--primary-light)' }}>
            <Upload size={28} style={{ color: 'var(--primary-accent)', marginBottom: '8px' }} />
            <div style={{ fontWeight: 600, fontSize: '13px' }}>Select document or drop file to upload</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Supports PDF, PNG, JPG, DOCX up to 50MB</div>
          </div>

          {isUploading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
                <span>Uploading file...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${uploadProgress}%`, height: '100%', backgroundColor: 'var(--primary-accent)', transition: 'width 0.2s' }} />
              </div>
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Document Name *</label>
            <input
              type="text"
              className="input-field"
              required
              disabled={isUploading}
              placeholder="e.g. County_Death_Certificate_Sterling.pdf"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="input-group">
              <label className="input-label">Folder Category</label>
              <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value as any)} disabled={isUploading}>
                <option value="Death Certificates">Death Certificates</option>
                <option value="Contracts">Contracts</option>
                <option value="Invoices">Invoices</option>
                <option value="Photos">Photos</option>
                <option value="IDs">IDs</option>
                <option value="Other Files">Other Files</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Linked Case (Optional)</label>
              <select className="input-field" value={caseId} onChange={(e) => setCaseId(e.target.value)} disabled={isUploading}>
                <option value="">-- Unlinked Document --</option>
                {cases.map(c => (
                  <option key={c.id} value={c.id}>{c.caseNumber} - {c.deceasedName}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isUploading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Confirm Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
