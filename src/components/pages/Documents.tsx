import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassificationLevel, UserRole } from '../../types';
import { 
  FileText, Upload, Search, ShieldCheck, ShieldAlert, Lock, AlertTriangle, 
  CheckCircle2, RefreshCw, Plus, Key, Eye, EyeOff, Hash, UserCheck
} from 'lucide-react';

export const Documents: React.FC = () => {
  const { 
    documents, 
    currentUser, 
    canAccessDocument, 
    uploadDocument, 
    tamperDocument,
    hasPermission 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassificationFilter, setSelectedClassificationFilter] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocForDetails, setSelectedDocForDetails] = useState<string | null>(null);

  // Upload Form State
  const [newTitle, setNewTitle] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newClassification, setNewClassification] = useState<ClassificationLevel>('Internal');
  const [newDepartment, setNewDepartment] = useState('Plant Maintenance');
  const [newContent, setNewContent] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(['Administrator', 'Engineer', 'Manager']);

  const rolesList: UserRole[] = ['Administrator', 'Engineer', 'Maintenance', 'Operations', 'Safety', 'Manager'];

  const handleToggleRole = (role: UserRole) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newFileName.trim()) return;

    uploadDocument({
      title: newTitle,
      fileName: newFileName,
      classification: newClassification,
      department: newDepartment,
      authorizedRoles: selectedRoles,
      fileSize: `${(Math.random() * 8 + 1).toFixed(1)} MB`,
      content: newContent || `DEFAULT INDUSTRIAL DOCUMENT CONTENT FOR ${newTitle}.\nAuthorized Personnel Only.`,
      metadata: {
        author: currentUser?.name || 'Anonymous Engineer',
        version: '1.0',
        equipmentTarget: 'Industrial Facility Asset'
      }
    });

    setShowUploadModal(false);
    setNewTitle('');
    setNewFileName('');
    setNewContent('');
  };

  // Filtered documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClassificationFilter === 'All' || doc.classification === selectedClassificationFilter;
    return matchesSearch && matchesClass;
  });

  const activeDocDetail = documents.find(d => d.id === selectedDocForDetails);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-400 mb-1">
            <ShieldCheck className="w-4 h-4" /> Confidentiality-Aware Document Vault
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Industrial Document Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Permission-aware search engine with SHA-256 cryptographic integrity verification.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md glow-cyan flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search documents by title, file, or department..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
          />
        </div>

        {/* Classification Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold shrink-0">Filter:</span>
          {['All', 'Public', 'Internal', 'Confidential', 'Restricted'].map(c => (
            <button
              key={c}
              onClick={() => setSelectedClassificationFilter(c)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedClassificationFilter === c
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map(doc => {
          const isAuthorized = currentUser 
            ? canAccessDocument(currentUser.role, doc.classification, doc.authorizedRoles)
            : false;

          return (
            <div 
              key={doc.id}
              className={`rounded-3xl border p-5 transition-all relative flex flex-col justify-between ${
                doc.isTampered
                  ? 'bg-rose-950/30 border-rose-500/60 glow-red'
                  : !isAuthorized
                  ? 'bg-slate-900/40 border-slate-800 opacity-75'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Classification & Status Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    doc.classification === 'Restricted' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    doc.classification === 'Confidential' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    doc.classification === 'Internal' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {doc.classification}
                  </span>

                  {doc.isTampered ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-mono font-bold border border-rose-500/30">
                      <AlertTriangle className="w-3 h-3 text-rose-400" /> INTEGRITY VIOLATION
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> VERIFIED
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-base leading-snug mb-1">
                  {doc.title}
                </h3>
                <div className="text-[11px] font-mono text-slate-400 mb-4">
                  {doc.fileName} • {doc.fileSize}
                </div>

                {/* Unauthorized Access Banner */}
                {!isAuthorized ? (
                  <div className="p-3 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs space-y-1 my-3">
                    <div className="font-bold font-mono text-rose-400 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" /> Document Restricted
                    </div>
                    <p className="text-[11px] opacity-90 leading-tight">
                      "This document is outside your authorized knowledge space."
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 mb-4 line-clamp-3 font-mono leading-relaxed">
                    {doc.content}
                  </div>
                )}
              </div>

              {/* Footer SHA-256 Fingerprint & Tampering Simulation Button */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3 text-cyan-400" /> SHA-256:
                  </span>
                  <span className="text-slate-400 truncate max-w-[150px]">
                    {doc.sha256.slice(0, 14)}...
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  {isAuthorized && (
                    <button
                      onClick={() => setSelectedDocForDetails(doc.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" /> Metadata
                    </button>
                  )}

                  {isAuthorized && (
                    <button
                      onClick={() => tamperDocument(doc.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                        doc.isTampered 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                          : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                      title="Simulate unauthorized content modification"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Simulate Tampering
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Upload Document */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-400" /> Upload Industrial Document
              </h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDoc} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Document Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. High Pressure Turbine Calibration Protocol"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">File Name</label>
                  <input
                    type="text"
                    value={newFileName}
                    onChange={e => setNewFileName(e.target.value)}
                    placeholder="e.g. CALIB_TURBINE_2026.pdf"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Department</label>
                  <select
                    value={newDepartment}
                    onChange={e => setNewDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Plant Maintenance">Plant Maintenance</option>
                    <option value="Safety">Safety</option>
                    <option value="Operations">Operations</option>
                    <option value="System Operations">System Operations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Security Classification</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Public', 'Internal', 'Confidential', 'Restricted'] as ClassificationLevel[]).map(cl => (
                    <button
                      key={cl}
                      type="button"
                      onClick={() => setNewClassification(cl)}
                      className={`py-2 rounded-xl border text-xs font-mono font-semibold transition-all ${
                        newClassification === cl
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {cl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Authorized Roles</label>
                <div className="flex flex-wrap gap-2">
                  {rolesList.map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleToggleRole(role)}
                      className={`px-3 py-1 rounded-lg border text-[11px] font-mono transition-all ${
                        selectedRoles.includes(role)
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold'
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Document Body Content</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Enter standard procedure or inspection raw text..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-md glow-cyan"
                >
                  Ingest & Generate SHA-256
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Metadata Detail Viewer */}
      {activeDocDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" /> Cryptographic Metadata
              </h3>
              <button onClick={() => setSelectedDocForDetails(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Title:</span>
                <span className="text-white font-semibold">{activeDocDetail.title}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Classification:</span>
                <span className="text-cyan-300 font-bold">{activeDocDetail.classification}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Department:</span>
                <span className="text-slate-300">{activeDocDetail.department}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Original Hash:</span>
                <span className="text-emerald-400 truncate max-w-[200px]">{activeDocDetail.originalSha256}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Current Hash:</span>
                <span className={activeDocDetail.isTampered ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                  {activeDocDetail.sha256}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDocForDetails(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-white font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
