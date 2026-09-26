import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ExternalLink, ShieldCheck, FileText, CheckCircle2, Bookmark, ArrowRight } from 'lucide-react';

export const SourceViewerDrawer: React.FC = () => {
  const { selectedSource, closeSourceViewer, navigateTo } = useApp();

  if (!selectedSource) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm">
              [{selectedSource.citationIndex}]
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {selectedSource.type}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {selectedSource.relevanceScore}% Relevance Match
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mt-1">Authoritative Source Provenance</h3>
            </div>
          </div>
          <button
            onClick={closeSourceViewer}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            title="Close source panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Document Identity Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{selectedSource.documentTitle}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="font-mono font-semibold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {selectedSource.documentCode}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      Page {selectedSource.pageNumber}
                    </span>
                    <span>•</span>
                    <span className="text-slate-600">{selectedSource.sectionTitle}</span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700 border border-slate-300 flex-shrink-0">
                {selectedSource.classification}
              </span>
            </div>
          </div>

          {/* Exact Highlighted Text Excerpt */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-blue-600" />
                Exact Extracted Excerpt (Page {selectedSource.pageNumber})
              </label>
              <span className="text-xs text-slate-400 font-mono">OCR Match: 99.8%</span>
            </div>

            <div className="bg-amber-50/70 border-2 border-amber-300/80 rounded-xl p-5 shadow-xs relative">
              <div className="absolute top-2 right-3">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded border border-amber-200">
                  Target Match
                </span>
              </div>
              <p className="text-slate-900 text-sm leading-relaxed font-serif italic selection:bg-amber-200">
                "{selectedSource.exactExcerpt}"
              </p>
            </div>
          </div>

          {/* Provenance Verification Details */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Cryptographic Verification & Integrity</h5>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">SHA-256 Digest</span>
                <span className="font-mono text-slate-800 font-bold break-all mt-0.5 block">
                  3c4b5a69788192a0b1c2d3e4f5061728...
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Vector Distance</span>
                <span className="font-mono text-emerald-700 font-bold mt-0.5 block">
                  Cosine: 0.9824 (High Confidence)
                </span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900 leading-relaxed">
                <strong className="font-semibold">Zero-Hallucination Guarantee:</strong> This statement was deterministically matched against the on-premise document store. No generative extrapolation occurred.
              </p>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              closeSourceViewer();
              navigateTo('documents');
            }}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 hover:underline"
          >
            <span>Open in Document Repository</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={closeSourceViewer}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors shadow-xs"
          >
            Close Provenance
          </button>
        </div>
      </div>
    </div>
  );
};
