import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Search, FileText, Database, CheckCircle2, ChevronRight, Layers, Eye } from 'lucide-react';

export const KnowledgeBase: React.FC = () => {
  const { sops, openSourceViewer, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredSops = sops.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.sopCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              RAG VECTOR KNOWLEDGE BASE
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Dense Chunking & Milvus Embeddings
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Refinery SOPs & Engineering Standards
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Indexed vector repository of Enterprise Standard Operating Procedures, OISD standards, ASME codes, and equipment turnaround manuals.
          </p>
        </div>

        <button
          onClick={() => showToast('Re-indexing Vector Store', 'Re-computing BGE-M3 1024-dim dense chunks in local Milvus instance...', 'info')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
        >
          <Database className="w-4 h-4" />
          <span>Re-Index Vector Chunks</span>
        </button>
      </div>

      {/* Vector Indexing Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total SOP Documents</span>
          <div className="text-2xl font-mono font-extrabold text-slate-900 mt-1">128</div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">100% Vector Indexed</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Dense Chunk Count</span>
          <div className="text-2xl font-mono font-extrabold text-blue-600 mt-1">4,820</div>
          <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">512 token chunks (BGE-M3)</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Vector Index Latency</span>
          <div className="text-2xl font-mono font-extrabold text-emerald-600 mt-1">1.4 ms</div>
          <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">HNSW / Cosine Metric</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Last Full Sync</span>
          <div className="text-sm font-bold text-slate-900 mt-2">2026-09-26 06:00</div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Air-Gapped Milvus Node</span>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search SOP code, procedure title, or mandatory rule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Category:</span>
          {['ALL', 'Mechanical', 'Safety', 'Operations'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white font-bold' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SOP List & Section Cards */}
      <div className="space-y-4">
        {filteredSops.map((sop) => (
          <div key={sop.id} className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
            
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold flex-shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {sop.sopCode}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">{sop.version} • Eff: {sop.effectiveDate}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mt-1 leading-snug">{sop.title}</h3>
                </div>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {sop.category}
              </span>
            </div>

            {/* Indexed Sections */}
            <div className="border-t border-slate-100 pt-3 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Indexed Authoritative Sections ({sop.sections.length} Chunks):
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sop.sections.map((sec) => (
                  <div key={sec.sectionId} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-blue-900">{sec.sectionNumber} — {sec.heading}</span>
                      <span className="text-[10px] font-mono text-slate-500">Page {sec.page}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-serif italic line-clamp-3">
                      "{sec.text}"
                    </p>
                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium truncate max-w-[240px]">
                        Rule: <strong className="text-slate-800">{sec.mandatoryRule}</strong>
                      </span>
                      <button
                        onClick={() => openSourceViewer(1)}
                        className="text-blue-600 font-bold hover:underline flex items-center gap-0.5"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
