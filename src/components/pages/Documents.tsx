import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentItem } from '../../types';
import { 
  FileText, UploadCloud, Search, ShieldCheck, Lock, Eye, 
  CheckCircle2, AlertTriangle, FileCode2, Image, FileSpreadsheet,
  Check, Filter, Download
} from 'lucide-react';

export const Documents: React.FC = () => {
  const { documents, currentUser, hasFieldAccess, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassification, setSelectedClassification] = useState<string>('ALL');

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClassification === 'ALL' || doc.classification === selectedClassification;
    return matchesSearch && matchesClass;
  });

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return <FileText className="w-5 h-5 text-rose-600" />;
      case 'png':
      case 'jpg': return <Image className="w-5 h-5 text-purple-600" />;
      case 'xlsx': return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      default: return <FileCode2 className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              AIR-GAPPED DOCUMENT STORE
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Field-Level Security Active
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Confidential Industrial Document Repository
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            On-premise indexed repository for P&IDs, NDT inspection logs, SOP procedures, and turnaround packages.
          </p>
        </div>

        <button
          onClick={() => showToast('Ingestion Queue Ready', 'Drag & drop new engineering files or connect local MinIO S3.', 'info')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload New Document</span>
        </button>
      </div>

      {/* Field-Level Security Banner Explanation */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <span className="text-slate-700">
            <strong className="font-semibold text-slate-900">Field-Level Access Control (RBAC):</strong> Displaying attributes authorized for your active role (<strong className="text-blue-700">{currentUser.roleTitle}</strong>). Unauthorized security classification metadata is omitted from rendering.
          </span>
        </div>
        {currentUser.role === 'CISO' ? (
          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-200">
            ALL SECURITY FIELDS REVEALED (CISO)
          </span>
        ) : (
          <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
            CISO-ONLY FIELDS OMITTED
          </span>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, equipment tag, or file name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Classification:</span>
          {['ALL', 'Internal', 'Confidential', 'Restricted'].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClassification(cls)}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                selectedClassification === cls 
                  ? 'bg-blue-600 text-white font-bold' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-card hover:border-blue-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 border border-slate-200">
                    {getFileIcon(doc.fileType)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">{doc.title}</h3>
                    <span className="font-mono text-xs text-slate-500">{doc.fileName} • {doc.fileSize}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {doc.classification}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {doc.description}
              </p>

              {/* Standard Metadata Fields (Visible to all authorized users) */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">Department</span>
                  <span className="font-medium text-slate-800">{doc.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">Uploaded By</span>
                  <span className="font-medium text-slate-800">{doc.uploadedBy.split(' ')[0]} {doc.uploadedBy.split(' ')[1] || ''}</span>
                </div>
              </div>

              {/* FIELD-LEVEL SECURITY DEMO: CISO-ONLY FIELDS (Section 23) */}
              {hasFieldAccess('securityClassification') && doc.securityClassification && (
                <div className="mt-3 p-3 bg-purple-50/70 border border-purple-200 rounded-lg space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900">
                      CISO Field: Security Classification
                    </span>
                    <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">
                      Risk Score: {doc.internalRiskScore}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-950 font-medium font-mono">
                    {doc.securityClassification}
                  </p>
                  <span className="text-[10px] font-mono text-purple-700 block">
                    Forensic Checksum: {doc.tamperChecksum}
                  </span>
                </div>
              )}
            </div>

            {/* Footer Status */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SHA-256 Verified</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('Document Download', `Downloading ${doc.fileName} from local air-gapped storage.`, 'info')}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Download file"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
