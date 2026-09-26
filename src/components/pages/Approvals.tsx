import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApprovalQueueItem } from '../../types';
import { 
  CheckCircle2, AlertTriangle, 
  FileText, ShieldCheck, Eye, Check, X, Edit3, Download, Clock
} from 'lucide-react';
import { downloadApprovalNotePDF } from '../../utils/exportUtils';

export const Approvals: React.FC = () => {
  const { 
    approvals, 
    approveDeliverable, 
    rejectDeliverable, 
    requestChangesDeliverable,
    openSourceViewer,
    currentUser,
    showToast 
  } = useApp();

  const [selectedApproval, setSelectedApproval] = useState<ApprovalQueueItem | null>(approvals[0] || null);
  const [signatureInput, setSignatureInput] = useState<string>('SIG_RSA4096_DR_SHETTY_MRPL_EXEC');
  const [reviewNotes, setReviewNotes] = useState<string>(
    'Approved conditionally. The proposed 18-month overhaul deferral is strictly rejected per SOP-4.2.1. Maximum overhaul interval enforced at 12 months (September 2027).'
  );
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredApprovals = approvals.filter(item => {
    if (filterStatus === 'ALL') return true;
    return item.status === filterStatus;
  });

  const handleApprove = (id: string) => {
    approveDeliverable(id, signatureInput, reviewNotes);
    setSelectedApproval(null);
  };

  const handleReject = (id: string) => {
    rejectDeliverable(id, reviewNotes || 'Rejected due to critical non-conformance with MRPL safety guidelines.');
    setSelectedApproval(null);
  };

  const handleRequestChanges = (id: string) => {
    requestChangesDeliverable(id, reviewNotes || 'Please revise the turnaround interval to comply with 12-month limit.');
    setSelectedApproval(null);
  };

  const handleDownloadPDF = (deliverable: ApprovalQueueItem['deliverable']) => {
    downloadApprovalNotePDF(deliverable, currentUser.name);
    showToast(
      'Exporting Technical Note PDF',
      `Downloading signed deliverable ${deliverable.referenceNumber}.`,
      'success'
    );
  };

  const riskBadgeStyles: Record<string, string> = {
    Low: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-800 border-amber-200',
    High: 'bg-rose-50 text-rose-800 border-rose-200',
    Critical: 'bg-rose-100 text-rose-950 border-rose-300 font-bold'
  };

  const statusBadgeStyles: Record<string, string> = {
    'Awaiting Review': 'bg-amber-50 text-amber-800 border-amber-200',
    'Approved': 'bg-emerald-50 text-emerald-800 border-emerald-200',
    'Rejected': 'bg-rose-50 text-rose-800 border-rose-200',
    'Needs Changes': 'bg-blue-50 text-blue-800 border-blue-200'
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              GOVERNANCE & EXECUTIVE SIGN-OFF
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Human-in-the-Loop Approval Queue
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Industrial Deliverables Approval Queue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review AI-synthesized technical notes, inspect SOP deviations, verify provenance, and apply cryptographic digital sign-off.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {['ALL', 'Awaiting Review', 'Approved', 'Needs Changes'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === status 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Approvals Table (Photo 3 Fix: Clean non-overlapping badge layout) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[920px]">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4 min-w-[220px]">Document / Deliverable</th>
                <th className="p-4 min-w-[130px]">Equipment Target</th>
                <th className="p-4 min-w-[140px]">Requester & Dept</th>
                <th className="p-4 min-w-[90px] whitespace-nowrap">Risk Level</th>
                <th className="p-4 min-w-[140px] whitespace-nowrap">SOP Deviation</th>
                <th className="p-4 min-w-[140px] whitespace-nowrap">Status</th>
                <th className="p-4 text-right min-w-[110px] whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {filteredApprovals.map((item) => (
                <tr 
                  key={item.id} 
                  className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                    selectedApproval?.id === item.id ? 'bg-blue-50/40' : ''
                  }`}
                  onClick={() => setSelectedApproval(item)}
                >
                  <td className="p-4">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs leading-snug">{item.title}</h4>
                        <span className="font-mono text-[10px] text-slate-500 block mt-0.5">{item.taskNumber} • {item.documentType}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-semibold text-slate-800">
                    {item.equipment}
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-slate-900 block leading-tight">{item.requester}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{item.department}</span>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${riskBadgeStyles[item.riskLevel] || 'bg-slate-100'}`}>
                      {item.riskLevel}
                    </span>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    {item.deviationDetected ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-200">
                        <AlertTriangle className="w-3 h-3 text-rose-600 flex-shrink-0" />
                        <span>Deviation Flagged</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Compliant</span>
                      </span>
                    )}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusBadgeStyles[item.status] || 'bg-slate-100'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Approved' ? 'bg-emerald-600' : item.status === 'Awaiting Review' ? 'bg-amber-600' : 'bg-rose-600'}`}></span>
                      <span>{item.status}</span>
                    </span>
                  </td>

                  <td className="p-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedApproval(item);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                    >
                      Inspect & Sign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Item Review & Sign-off Drawer/Modal */}
      {selectedApproval && (
        <div className="bg-white rounded-2xl border-2 border-blue-500/80 shadow-card p-6 space-y-5">
          
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded border border-blue-200">
                  {selectedApproval.deliverable.referenceNumber}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadgeStyles[selectedApproval.status]}`}>
                  {selectedApproval.status}
                </span>
              </div>
              <h2 className="text-base font-extrabold text-slate-900 mt-1">
                {selectedApproval.deliverable.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Submitted by {selectedApproval.requester} ({selectedApproval.requesterRole}) on {selectedApproval.submittedAt}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openSourceViewer(1)}
                className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Supporting Sources</span>
              </button>

              <button
                onClick={() => handleDownloadPDF(selectedApproval.deliverable)}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* SOP Deviation Callout */}
          {selectedApproval.deviationDetected && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>MANDATORY SOP DEVIATION OVERRULE REQUIRED</span>
              </div>
              <p className="text-xs text-rose-950 leading-relaxed">
                {selectedApproval.deviationSummary} SOP-4.2.1 mandates an inspection frequency of 12 months for sour crude service. Deferral to 18 months requires executive mitigation.
              </p>
            </div>
          )}

          {/* Executive Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Executive Summary & Recommendation
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {selectedApproval.deliverable.executiveSummary}
            </p>
          </div>

          {/* Sign-off Form Controls */}
          <div className="border-t border-slate-200 pt-4 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Approving Authority Digital Sign-Off Panel
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Digital RSA Signature / Approval Token
                </label>
                <input
                  type="text"
                  value={signatureInput}
                  onChange={(e) => setSignatureInput(e.target.value)}
                  className="w-full text-xs font-mono p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Executive Notes & Direction
                </label>
                <input
                  type="text"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-blue-600"
                />
              </div>
            </div>

            {/* Approval Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => handleReject(selectedApproval.id)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>

              <button
                onClick={() => handleRequestChanges(selectedApproval.id)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Request Modifications</span>
              </button>

              <button
                onClick={() => handleApprove(selectedApproval.id)}
                className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Apply Digital Sign-Off & Approve</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
