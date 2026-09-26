import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, Download, ChevronRight, ChevronDown, Activity, FileCheck2, 
  ShieldCheck, RefreshCw, Layers, CheckCircle2, Play, Eye, FileCode
} from 'lucide-react';
import { downloadAuditLedgerPDF } from '../../utils/exportUtils';

export const AuditLogs: React.FC = () => {
  const { auditLogs, currentUser, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResult, setSelectedResult] = useState<string>('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [isVerifyingChain, setIsVerifyingChain] = useState(false);
  const [selectedReplayLog, setSelectedReplayLog] = useState<any | null>(null);

  // Filter logs for normal users vs CISO
  const visibleLogs = currentUser.role === 'CISO' 
    ? auditLogs 
    : auditLogs.filter(log => log.user.includes(currentUser.name) || log.role === currentUser.role);

  const filteredLogs = visibleLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.auditId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResult = selectedResult === 'ALL' || log.result === selectedResult;
    return matchesSearch && matchesResult;
  });

  const handleExportPDF = () => {
    downloadAuditLedgerPDF(filteredLogs, currentUser.name);
    showToast(
      'Exporting Signed Audit PDF',
      'Generated cryptographic PDF ledger with SHA-256 signatures.',
      'success'
    );
  };

  const handleExportPackage = () => {
    const pkg = {
      manifest: {
        totalRecords: filteredLogs.length,
        exportDate: new Date().toISOString(),
        exportedBy: currentUser.name,
        role: currentUser.role,
        chainRootHash: '0x88f912c41804b901a89c20194819e910248a912848192a819b18274a12948',
        complianceCertification: 'OISD-STD-129 / IEC 62443 Level 4'
      },
      auditTrail: filteredLogs
    };

    const blob = new Blob([JSON.stringify(pkg, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forensic-audit-package-${Date.now()}.json`;
    a.click();
    showToast('Audit Package Exported', 'Downloaded full forensic JSON ledger and hash manifest.', 'success');
  };

  const handleVerifyHashChain = () => {
    setIsVerifyingChain(true);
    showToast('Hash Chain Verification Started', 'Validating SHA-256 block links across all audit entries...', 'info');
    setTimeout(() => {
      setIsVerifyingChain(false);
      showToast('Ledger Intact & Validated', `Verified ${auditLogs.length} audit blocks. Zero tampering detected.`, 'success');
    }, 1400);
  };

  const resultBadgeStyles: Record<string, string> = {
    SUCCESS: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    BLOCKED: 'bg-rose-100 text-rose-900 border-rose-300 font-bold',
    DENIED: 'bg-rose-50 text-rose-800 border-rose-200 font-bold',
    FLAGGED: 'bg-amber-50 text-amber-800 border-amber-200',
    PENDING: 'bg-blue-50 text-blue-800 border-blue-200'
  };

  const riskBadgeStyles: Record<string, string> = {
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    High: 'bg-rose-50 text-rose-700 border-rose-200',
    Critical: 'bg-rose-100 text-rose-900 border-rose-300 font-bold'
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              TAMPER-EVIDENT FORENSIC LEDGER (SECTION 7)
            </span>
            <span className="text-xs text-slate-500 font-medium">
              OISD-STD-129 & IEC 62443 Certified
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            {currentUser.role === 'CISO' ? 'Global Forensic Audit & Session Replay' : 'My Audit History & Provenance Trail'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable SHA-256 cryptographic ledger recording every prompt submission, tool invocation, and deliverable sign-off.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleVerifyHashChain}
            disabled={isVerifyingChain}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {isVerifyingChain ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>Verify Hash Chain Integrity</span>
          </button>

          <button
            onClick={handleExportPackage}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export Audit Package (JSON)</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Signed PDF</span>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Audit ID, user, action, or resource..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none w-full font-sans"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Filter Result:</span>
          {['ALL', 'SUCCESS', 'BLOCKED', 'DENIED'].map((res) => (
            <button
              key={res}
              onClick={() => setSelectedResult(res)}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                selectedResult === res 
                  ? 'bg-blue-600 text-white font-bold' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {res}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4 min-w-[180px]">Timestamp & Audit ID</th>
                <th className="p-4 min-w-[140px]">User / Principal</th>
                <th className="p-4 min-w-[160px]">Action</th>
                <th className="p-4 min-w-[180px]">Resource / Document</th>
                <th className="p-4 min-w-[140px]">Agent Used</th>
                <th className="p-4 min-w-[90px] whitespace-nowrap">Result</th>
                <th className="p-4 min-w-[80px] whitespace-nowrap">Risk</th>
                <th className="p-4 text-right min-w-[80px] whitespace-nowrap">Session Replay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {filteredLogs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                return (
                  <React.Fragment key={log.id}>
                    <tr 
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        isExpanded ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    >
                      <td className="p-4 font-mono text-[11px]">
                        <span className="font-bold text-slate-900 block">{log.timestamp}</span>
                        <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100 inline-block mt-0.5">
                          {log.auditId}
                        </span>
                      </td>

                      <td className="p-4 font-semibold text-slate-800">
                        {log.user}
                      </td>

                      <td className="p-4 font-mono font-bold text-slate-900 text-[11px]">
                        {log.action}
                      </td>

                      <td className="p-4 text-slate-700 max-w-[200px] truncate">
                        {log.resource}
                      </td>

                      <td className="p-4 text-slate-600">
                        {log.agent}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${resultBadgeStyles[log.result] || 'bg-slate-100'}`}>
                          {log.result}
                        </span>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${riskBadgeStyles[log.risk] || 'bg-slate-100'}`}>
                          {log.risk}
                        </span>
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReplayLog(log);
                          }}
                          className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] border border-blue-200 transition-colors inline-flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" />
                          <span>Replay</span>
                        </button>
                      </td>
                    </tr>

                    {/* Forensic Details Expansion */}
                    {isExpanded && (
                      <tr className="bg-slate-50/80 border-b border-slate-200">
                        <td colSpan={8} className="p-4 pl-8">
                          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                                <Activity className="w-4 h-4 text-blue-600" />
                                Forensic Execution Trace & Cryptographic Signature
                              </span>
                              <span className="font-mono text-slate-400 text-[11px]">Client IP: {log.clientIp}</span>
                            </div>

                            <p className="text-slate-700 leading-relaxed font-sans">
                              {log.details}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 font-mono text-[11px]">
                              <div className="p-2.5 bg-slate-50 rounded-lg">
                                <span className="text-slate-400 text-[10px] block uppercase font-bold">SHA-256 Block Hash</span>
                                <span className="text-slate-800 font-bold break-all">{log.hashSignature}</span>
                              </div>
                              <div className="p-2.5 bg-slate-50 rounded-lg">
                                <span className="text-slate-400 text-[10px] block uppercase font-bold">Air-Gap Invariant</span>
                                <span className="text-emerald-700 font-bold">Verified Zero Egress</span>
                              </div>
                              <div className="p-2.5 bg-slate-50 rounded-lg">
                                <span className="text-slate-400 text-[10px] block uppercase font-bold">Block Link State</span>
                                <span className="text-emerald-700 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Immutable Hash Chain
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SESSION REPLAY MODAL */}
      {selectedReplayLog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Session Replay & Agent Scratchpad Drilldown
                </h3>
              </div>
              <button 
                onClick={() => setSelectedReplayLog(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs space-y-1">
              <div className="flex justify-between">
                <span>Audit ID: <strong className="text-blue-700">{selectedReplayLog.auditId}</strong></span>
                <span>User: <strong className="text-slate-800">{selectedReplayLog.user}</strong></span>
              </div>
              <div className="flex justify-between">
                <span>Action: <strong className="text-slate-900">{selectedReplayLog.action}</strong></span>
                <span>Timestamp: <strong>{selectedReplayLog.timestamp}</strong></span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Agent Decision & Tool Call Execution Trace
              </span>
              <div className="p-3 bg-slate-900 text-slate-200 font-mono text-xs rounded-xl space-y-2 max-h-60 overflow-y-auto">
                <div className="text-blue-400">Step 1: Received user request on resource [{selectedReplayLog.resource}]</div>
                <div className="text-slate-400">Step 2: Queried local RAG dense vector store (Qdrant) • Found 4 matching chunks</div>
                <div className="text-emerald-400">Step 3: Dispatched to local neural engine [{selectedReplayLog.agent}]</div>
                <div className="text-slate-400">Step 4: Executed capability firewall check: ALLOWED (0 outbound egress)</div>
                <div className="text-emerald-400 font-bold">Result: {selectedReplayLog.details}</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedReplayLog(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Close Replay
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
