import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, Search, FileText, Database, CheckCircle2, ChevronRight, 
  Layers, Eye, RefreshCw, Settings2, Sliders, Server, Radio, Play, Check, X
} from 'lucide-react';

interface VectorCollection {
  name: string;
  category: string;
  totalChunks: number;
  embeddingModel: string;
  indexSize: string;
  memoryUsage: string;
  lastUpdated: string;
  status: 'HEALTHY' | 'SYNCING' | 'NEEDS_REINDEX';
}

interface EnterpriseConnector {
  name: string;
  type: string;
  status: 'CONNECTED (DATA DIODE)' | 'ONLINE (READ-ONLY)' | 'SCHEDULED SYNC';
  endpoint: string;
  lastSync: string;
  recordsIndexed: number;
  diodeIsolated: boolean;
}

export const KnowledgeBase: React.FC = () => {
  const { sops, openSourceViewer, showToast, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'sops' | 'vectorAdmin' | 'connectors'>('sops');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Vector Collections State (Section 10)
  const [collections, setCollections] = useState<VectorCollection[]>([
    {
      name: 'Plant SOPs & OISD Guidelines',
      category: 'Operations & Safety',
      totalChunks: 4820,
      embeddingModel: 'BAAI BGE-M3 (1024-dim dense + sparse)',
      indexSize: '1.42 GB',
      memoryUsage: '380 MB',
      lastUpdated: '2026-09-26 06:00:00 IST',
      status: 'HEALTHY'
    },
    {
      name: 'P&ID Engineering Drawings & Isometrics',
      category: 'Visual & CAD Layouts',
      totalChunks: 2150,
      embeddingModel: 'Qwen-2.5-VL Patch Embeddings',
      indexSize: '3.80 GB',
      memoryUsage: '940 MB',
      lastUpdated: '2026-09-26 04:30:00 IST',
      status: 'HEALTHY'
    },
    {
      name: 'Turnaround Incident & Past Review Reports',
      category: 'Historical Knowledge',
      totalChunks: 1940,
      embeddingModel: 'BAAI BGE-M3 (1024-dim)',
      indexSize: '680 MB',
      memoryUsage: '190 MB',
      lastUpdated: '2026-09-25 18:00:00 IST',
      status: 'HEALTHY'
    },
    {
      name: 'OEM Vendor Equipment Manuals (API 610/510)',
      category: 'Vendor Specifications',
      totalChunks: 3410,
      embeddingModel: 'BAAI BGE-M3 (1024-dim)',
      indexSize: '1.10 GB',
      memoryUsage: '320 MB',
      lastUpdated: '2026-09-25 12:00:00 IST',
      status: 'HEALTHY'
    }
  ]);

  // Test RAG Retrieval Query
  const [testQuery, setTestQuery] = useState('');
  const [testResults, setTestResults] = useState<{ chunkText: string; similarity: number; docTitle: string }[] | null>(null);

  // Connectors State (Section 12)
  const [connectors, setConnectors] = useState<EnterpriseConnector[]>([
    {
      name: 'SAP Plant Maintenance (PM / ERP)',
      type: 'ERP Work Order Sync',
      status: 'ONLINE (READ-ONLY)',
      endpoint: 'sap-rfc://10.14.20.10:3300/RFC_READ_TABLE',
      lastSync: '12 minutes ago',
      recordsIndexed: 14200,
      diodeIsolated: false
    },
    {
      name: 'Honeywell Experion / SCADA Historian',
      type: 'Process Sensor Telemetry Diode',
      status: 'CONNECTED (DATA DIODE)',
      endpoint: 'diode-rx://10.14.99.2:502/OPC_UA_STREAM',
      lastSync: 'Continuous (1s interval)',
      recordsIndexed: 894000,
      diodeIsolated: true
    },
    {
      name: 'OpenText Documentum (DMS)',
      type: 'Approved Engineering Archive',
      status: 'SCHEDULED SYNC',
      endpoint: 'https://dms.internal.enterprise.local/api/v2',
      lastSync: '1 hour ago',
      recordsIndexed: 2840,
      diodeIsolated: false
    }
  ]);

  const filteredSops = sops.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.sopCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleTestSearch = () => {
    if (!testQuery) return;
    showToast('Vector Similarity Search Dispatched', 'Executing dense cosine distance search across Qdrant...', 'info');
    setTimeout(() => {
      setTestResults([
        {
          docTitle: 'SOP-MECH-042: Hydrocarbon Centrifugal Pump Mechanical Seal Flush Plan 53A',
          chunkText: 'Section 4.2.1: In all Plan 53A seal configurations, barrier fluid pressure must be maintained at a minimum of 1.4 bar (20 psi) above maximum seal chamber pressure...',
          similarity: 0.942
        },
        {
          docTitle: 'API 682 4th Edition - Pumps - Shaft Sealing Systems',
          chunkText: 'Clause 7.1.3: Barrier fluid reservoir must include level transmitter and high/low pressure switch interlocks hardwired to DCS alert matrix...',
          similarity: 0.887
        }
      ]);
    }, 600);
  };

  const handleReindex = (collectionName: string) => {
    showToast('Re-indexing Collection', `Computing embeddings for [${collectionName}] with 512-token chunks...`, 'info');
    setTimeout(() => {
      showToast('Re-indexing Complete', `Collection [${collectionName}] index rebuilt successfully.`, 'success');
    }, 1500);
  };

  const handleTestConnector = (name: string) => {
    showToast('Connector Health Check', `Testing read-only socket handshake to ${name}... OK (0.8ms latency)`, 'success');
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              RAG VECTOR KNOWLEDGE BASE & CONNECTORS (SECTIONS 10 & 12)
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Qdrant Dense Embedding Engine
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Industrial SOPs, Standards & Vector Store Admin
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage vector collections, chunking hyperparameters, semantic retrieval test benches, and air-gapped industrial SCADA connectors.
          </p>
        </div>

        <button
          onClick={() => handleReindex('All Collections')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
        >
          <Database className="w-4 h-4" />
          <span>Re-Index Vector Collections</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('sops')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'sops'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>SOP & Standards Catalog ({sops.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vectorAdmin')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'vectorAdmin'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Vector Collections & Retrieval Test Bench</span>
        </button>

        <button
          onClick={() => setActiveTab('connectors')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'connectors'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Enterprise Connectors & Data Diode</span>
        </button>
      </div>

      {/* TAB 1: SOP CATALOG */}
      {activeTab === 'sops' && (
        <div className="space-y-6">
          {/* Vector Indexing Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total SOP Documents</span>
              <div className="text-2xl font-mono font-extrabold text-slate-900 mt-1">128</div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">100% Vector Indexed</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Dense Chunk Count</span>
              <div className="text-2xl font-mono font-extrabold text-blue-600 mt-1">12,320</div>
              <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">512 token chunks (BGE-M3)</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Vector Search Latency</span>
              <div className="text-2xl font-mono font-extrabold text-emerald-600 mt-1">1.2 ms</div>
              <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">HNSW / Cosine Metric</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Last Full Sync</span>
              <div className="text-sm font-bold text-slate-900 mt-2">2026-09-26 06:00</div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Air-Gapped Qdrant Cluster</span>
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
                className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none w-full font-sans"
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

          {/* SOP Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSops.map((sop) => {
              const firstSection = sop.sections[0];
              return (
                <div key={sop.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card hover:border-blue-300 transition-all flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {sop.sopCode}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Ver: {sop.version}</span>
                    </div>

                    <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{sop.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {firstSection ? firstSection.text.slice(0, 160) + '...' : 'Engineering Standard procedure definition.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-500">{sop.category}</span>
                    <button
                      onClick={() => openSourceViewer(1)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Grounding</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: VECTOR ADMIN & TEST BENCH */}
      {activeTab === 'vectorAdmin' && (
        <div className="space-y-6">
          {/* Vector Collections Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700 flex justify-between items-center">
              <span>LOCAL QDRANT VECTOR COLLECTIONS</span>
              <span className="text-[10px] font-mono text-slate-500">Dense Embedding Dim: 1024 (BGE-M3)</span>
            </div>

            <div className="divide-y divide-slate-200">
              {collections.map((c, idx) => (
                <div key={idx} className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50/70">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900">{c.name}</h4>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {c.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-1 space-x-3">
                      <span>Model: <strong className="text-slate-700">{c.embeddingModel}</strong></span>
                      <span>•</span>
                      <span>Chunks: <strong className="text-blue-600">{c.totalChunks.toLocaleString()}</strong></span>
                      <span>•</span>
                      <span>Size: <strong className="text-slate-700">{c.indexSize}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReindex(c.name)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                    >
                      Re-Index Chunks
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Semantic Search Bench */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">
              Semantic RAG Retrieval Test Bench
            </h3>
            <p className="text-xs text-slate-500">
              Test dense vector search across on-premise collections and inspect cosine similarity scores and chunk boundaries.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter test prompt (e.g. Plan 53A barrier fluid pressure threshold API 682)..."
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
              <button
                onClick={handleTestSearch}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span>Test Top-K Search</span>
              </button>
            </div>

            {testResults && (
              <div className="space-y-3 pt-2">
                {testResults.map((r, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-900">{r.docTitle}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                        Cosine Similarity: {(r.similarity * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-mono leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                      {r.chunkText}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ENTERPRISE CONNECTORS */}
      {activeTab === 'connectors' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700">
              AIR-GAPPED ENTERPRISE SYSTEM CONNECTORS & DATA DIODES
            </div>

            <div className="divide-y divide-slate-200">
              {connectors.map((conn, idx) => (
                <div key={idx} className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50/70">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900">{conn.name}</h4>
                      {conn.diodeIsolated && (
                        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                          HARDWARE DIODE ISOLATED
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-1 space-x-3">
                      <span>Endpoint: <strong className="text-slate-700">{conn.endpoint}</strong></span>
                      <span>•</span>
                      <span>Records: <strong className="text-blue-600">{conn.recordsIndexed.toLocaleString()}</strong></span>
                      <span>•</span>
                      <span>Sync: <strong className="text-slate-700">{conn.lastSync}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {conn.status}
                    </span>
                    <button
                      onClick={() => handleTestConnector(conn.name)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                    >
                      Test Connection
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
