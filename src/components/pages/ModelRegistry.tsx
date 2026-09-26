import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Cpu, ShieldCheck, CheckCircle2, RefreshCw, HardDrive, Zap, 
  Check, AlertCircle, Upload, ArrowRight, Play, Server, Layers,
  Sliders, Activity, Plus, ShieldAlert, Sparkles, Database, FileCheck
} from 'lucide-react';

interface RoutingRule {
  taskType: string;
  primaryModel: string;
  secondaryModel: string;
  fallbackModel: string;
  priorityLevel: 'Standard' | 'High (VIP Priority)' | 'Critical (SCADA Incident)';
  temperature: number;
}

interface BenchmarkResult {
  id: string;
  prompt: string;
  category: string;
  expectedKeywords: string[];
  latencyMs: number;
  tps: number;
  passRate: number;
  driftScore: string;
  status: 'PASSED' | 'BENCHMARKING' | 'WARN';
}

export const ModelRegistry: React.FC = () => {
  const { models, verifyModelIntegrity, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'catalog' | 'routing' | 'benchmark'>('catalog');
  
  // Model state modifiers (load / unload simulation)
  const [modelStates, setModelStates] = useState<Record<string, { loaded: boolean; vram: number }>>({
    'mod-deepseek-r1': { loaded: true, vram: 42.4 },
    'mod-qwen-72b': { loaded: true, vram: 44.1 },
    'mod-qwen-coder': { loaded: true, vram: 19.8 },
    'mod-qwen-vl': { loaded: true, vram: 43.6 },
    'mod-bge-m3': { loaded: true, vram: 2.2 },
    'mod-tesseract': { loaded: true, vram: 1.1 },
  });

  // Modal for adding new air-gapped model via USB
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importForm, setImportForm] = useState({
    name: '',
    parameters: '32B',
    quantization: 'Q4_K_M (GGUF)',
    vramRequired: '18 GB',
    sha256: '',
    usbDevice: '/dev/sdb1 (Secure Kingston IronKey USB)',
    formatVerified: true
  });

  // Routing Rules State
  const [routingRules, setRoutingRules] = useState<RoutingRule[]>([
    {
      taskType: 'Engineering Reasoning & Root Cause Analysis',
      primaryModel: 'DeepSeek-R1-Distill-70B (Local)',
      secondaryModel: 'Qwen-2.5-72B-Instruct',
      fallbackModel: 'Qwen-2.5-14B-Fast',
      priorityLevel: 'High (VIP Priority)',
      temperature: 0.1
    },
    {
      taskType: 'P&ID / Technical Drawing Vision Analysis',
      primaryModel: 'Qwen-2.5-VL-72B-Vision (Local)',
      secondaryModel: 'PaddleOCR + LayoutLMv3',
      fallbackModel: 'Tesseract OCR Engine',
      priorityLevel: 'Critical (SCADA Incident)',
      temperature: 0.0
    },
    {
      taskType: 'Automation & PLC Code Synthesis',
      primaryModel: 'Qwen-2.5-Coder-32B (Local)',
      secondaryModel: 'DeepSeek-R1-Distill-70B',
      fallbackModel: 'Qwen-2.5-14B-Fast',
      priorityLevel: 'Standard',
      temperature: 0.2
    },
    {
      taskType: 'Semantic Retrieval & RAG Dense Search',
      primaryModel: 'BAAI BGE-M3 Dense Embedding (Local)',
      secondaryModel: 'BGE-Large-EN-v1.5',
      fallbackModel: 'BM25 Lexical Keyword Engine',
      priorityLevel: 'Standard',
      temperature: 0.0
    },
    {
      taskType: 'General SOP Ingestion & Summarization',
      primaryModel: 'Qwen-2.5-72B-Instruct (Local)',
      secondaryModel: 'DeepSeek-R1-Distill-70B',
      fallbackModel: 'Qwen-2.5-14B-Fast',
      priorityLevel: 'Standard',
      temperature: 0.2
    }
  ]);

  // Golden Dataset Benchmark State
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkResult[]>([
    {
      id: 'bn-1',
      prompt: 'API 510 Pressure Vessel Minimum Thickness Calculation (Corrosion rate: 0.15 mm/yr)',
      category: 'Mechanical Engineering',
      expectedKeywords: ['t_min', 'MAWP', 'Corrosion Allowance', 'API 510 Section 7.1'],
      latencyMs: 342,
      tps: 68.4,
      passRate: 100,
      driftScore: '0.00% (Bit-Identical)',
      status: 'PASSED'
    },
    {
      id: 'bn-2',
      prompt: 'HAZOP Node 4 Flange Leak Matrix (High Pressure Hydrocarbon Line P&ID-042)',
      category: 'Process Safety',
      expectedKeywords: ['Deviation', 'Consequence', 'Safeguards', 'SIL-2 Interlock'],
      latencyMs: 410,
      tps: 64.2,
      passRate: 100,
      driftScore: '0.01% (Within Tolerance)',
      status: 'PASSED'
    },
    {
      id: 'bn-3',
      prompt: 'Modbus TCP Register Address Parser for Gas Turbine Vibration Sensor (Hex 0x04)',
      category: 'IT / SCADA Automation',
      expectedKeywords: ['Function Code 03', 'Register 40001', 'CRC16', 'Exception 0x83'],
      latencyMs: 295,
      tps: 72.8,
      passRate: 99.8,
      driftScore: '0.00% (Bit-Identical)',
      status: 'PASSED'
    }
  ]);

  const toggleModelLoad = (modelId: string, modelName: string) => {
    const current = modelStates[modelId] || { loaded: true, vram: 20 };
    const nextState = !current.loaded;
    setModelStates({
      ...modelStates,
      [modelId]: { ...current, loaded: nextState }
    });
    if (nextState) {
      showToast('Model Loaded into VRAM', `${modelName} allocated ${current.vram} GB VRAM on GPU Node 0/1.`, 'success');
    } else {
      showToast('Model Unloaded', `${modelName} purged from VRAM to disk cache.`, 'info');
    }
  };

  const handleRunBenchmark = () => {
    setIsBenchmarking(true);
    showToast('Benchmark Suite Started', 'Executing 3 golden industrial test vectors across GPU cluster...', 'info');
    setTimeout(() => {
      setIsBenchmarking(false);
      showToast('Benchmark Complete', 'Cluster drift score: 0.003%. Model weights 100% deterministic.', 'success');
    }, 1800);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsImportModalOpen(false);
    showToast('Air-Gapped Model Ingested', `${importForm.name} verified and registered from ${importForm.usbDevice}.`, 'success');
  };

  // Calculated VRAM Total
  const totalAllocatedVram = Object.values(modelStates).reduce((sum, curr) => curr.loaded ? sum + curr.vram : sum, 0);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              AIR-GAPPED MODEL WEIGHTS & RUNTIMES (SECTION 3)
            </span>
            <span className="text-xs text-slate-500 font-medium">
              vLLM Local Server Engine
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Local Model Registry & Routing Plane
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage on-premise LLM weights, safetensors integrity checks, dynamic task routing rules, and golden benchmark quality tests.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Import Model (USB / Offline)</span>
          </button>
          <button
            onClick={() => showToast('Cluster Health Check', 'All local model engines and GPU CUDA cores verified healthy.', 'success')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Verify CUDA Cluster</span>
          </button>
        </div>
      </div>

      {/* Cluster VRAM & Hardware Strip */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>NVIDIA H100 Dual-Node PCIe (Air-Gapped Cluster)</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold rounded">
                  ONLINE • 0 EGRESS
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Total VRAM: 160.0 GB • Allocated: {totalAllocatedVram.toFixed(1)} GB ({(totalAllocatedVram/1.6).toFixed(0)}% Utilized)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-slate-400 text-[10px] block">Avg Token Speed</span>
              <span className="text-emerald-400 font-bold text-sm">68.2 tps</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[10px] block">Cold Weights on NVMe</span>
              <span className="text-blue-300 font-bold text-sm">4.2 TB</span>
            </div>
          </div>
        </div>

        {/* VRAM Allocation Visual Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>VRAM Allocation Breakdown</span>
            <span>{totalAllocatedVram.toFixed(1)} / 160 GB ({(160 - totalAllocatedVram).toFixed(1)} GB Free for KV Cache)</span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div style={{ width: '27%' }} className="bg-blue-500" title="DeepSeek-R1 (42.4 GB)" />
            <div style={{ width: '28%' }} className="bg-indigo-500" title="Qwen-72B (44.1 GB)" />
            <div style={{ width: '13%' }} className="bg-emerald-500" title="Qwen-Coder (19.8 GB)" />
            <div style={{ width: '27%' }} className="bg-amber-500" title="Qwen-VL (43.6 GB)" />
            <div style={{ width: '5%' }} className="bg-slate-700" title="Free VRAM Buffer" />
          </div>
          <div className="flex flex-wrap gap-4 text-[10px] font-mono text-slate-400 pt-1">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500" /> DeepSeek-R1 (42.4G)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-indigo-500" /> Qwen-72B (44.1G)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500" /> Qwen-Coder (19.8G)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500" /> Qwen-VL (43.6G)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-slate-700" /> KV Cache Headroom</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Local Model Catalog ({models.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('routing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'routing'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ArrowRight className="w-4 h-4" />
          <span>Task-to-Model Routing Rules ({routingRules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('benchmark')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'benchmark'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Golden Dataset Benchmarks & Drift</span>
        </button>
      </div>

      {/* TAB 1: MODEL CATALOG */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map((m) => {
            const state = modelStates[m.id] || { loaded: true, vram: m.vramUsageGb };
            return (
              <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:border-blue-300 transition-all flex flex-col justify-between space-y-4">
                
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {m.category}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                      state.loaded 
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                        : 'text-slate-600 bg-slate-100 border-slate-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${state.loaded ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      {state.loaded ? 'LOADED IN VRAM' : 'COLD ON DISK'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{m.name}</h3>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{m.parameters} • {m.quantization}</p>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {m.description}
                  </p>

                  {/* Hardware Performance Metrics */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">VRAM</span>
                      <span className="font-mono font-bold text-slate-800">{m.vramUsageGb} GB</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Latency</span>
                      <span className="font-mono font-bold text-slate-800">{m.inferenceLatencyMs} ms</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Speed</span>
                      <span className="font-mono font-bold text-blue-600">{m.tpsSpeed} tps</span>
                    </div>
                  </div>

                  {/* Cryptographic SHA-256 Digest */}
                  <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-slate-500 text-[10px]">
                      <span>SHA-256 SAFETENSORS CHECKSUM</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </span>
                    </div>
                    <span className="text-slate-700 break-all block mt-0.5">
                      {m.sha256Hash.slice(0, 32)}...
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-mono">Ver: {m.version}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleModelLoad(m.id, m.name)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        state.loaded 
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200' 
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {state.loaded ? 'Unload VRAM' : 'Load to VRAM'}
                    </button>
                    <button
                      onClick={() => verifyModelIntegrity(m.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors shadow-2xs flex items-center gap-1"
                      title="Run SHA-256 Bit-level Hash Check against Hardware Key"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Verify</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: ROUTING RULES */}
      {activeTab === 'routing' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-3">
            <Server className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-bold text-blue-950">Dynamic Task-to-Model Routing Engine</strong>
              Industrial queries are automatically classified by intent, safety level, and compute requirements, routing to the optimal local neural engine with automated failover chains.
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-card">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700 flex justify-between items-center">
              <span>ACTIVE TASK ROUTING & FAILOVER POLICIES</span>
              <button 
                onClick={() => showToast('Routing Rules Saved', 'Task routing configuration deployed to local vLLM gateway.', 'success')}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
              >
                Save & Deploy Rules
              </button>
            </div>
            
            <div className="divide-y divide-slate-200">
              {routingRules.map((rule, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50/70 transition-colors space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900">{rule.taskType}</h4>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      rule.priorityLevel.includes('Critical') 
                        ? 'bg-rose-50 text-rose-700 border-rose-200' 
                        : rule.priorityLevel.includes('High')
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {rule.priorityLevel}
                    </span>
                  </div>

                  {/* Failover Chain Pipeline */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                      <div className="text-[10px] font-mono font-bold text-emerald-800 uppercase flex items-center justify-between">
                        <span>1. Primary Model</span>
                        <span className="text-emerald-600">ONLINE</span>
                      </div>
                      <div className="font-bold text-slate-900 mt-1">{rule.primaryModel}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">Temp: {rule.temperature} • Greedy Decoding</div>
                    </div>

                    <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl">
                      <div className="text-[10px] font-mono font-bold text-blue-800 uppercase flex items-center justify-between">
                        <span>2. Secondary Failover</span>
                        <span className="text-blue-600">STANDBY</span>
                      </div>
                      <div className="font-bold text-slate-900 mt-1">{rule.secondaryModel}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">Triggers on &gt;800ms latency / VRAM queue</div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-[10px] font-mono font-bold text-slate-600 uppercase flex items-center justify-between">
                        <span>3. Emergency Fallback</span>
                        <span className="text-slate-500">COLD</span>
                      </div>
                      <div className="font-bold text-slate-900 mt-1">{rule.fallbackModel}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">Low-compute deterministic engine</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GOLDEN DATASET BENCHMARKS */}
      {activeTab === 'benchmark' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Golden Industrial Test Vectors & Drift Detection
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated validation suite evaluating local model inference against certified ASME, API, and safety benchmarks.
                </p>
              </div>

              <button
                onClick={handleRunBenchmark}
                disabled={isBenchmarking}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isBenchmarking ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing Golden Tests...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Run Golden Benchmark Suite</span>
                  </>
                )}
              </button>
            </div>

            {/* Benchmark Cards */}
            <div className="space-y-3 pt-2">
              {benchmarkResults.map((b) => (
                <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {b.category}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900">{b.prompt}</h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {b.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-600 pt-1">
                    <span>Latency: <strong>{b.latencyMs} ms</strong></span>
                    <span>Speed: <strong>{b.tps} tps</strong></span>
                    <span>Pass Rate: <strong>{b.passRate}%</strong></span>
                    <span>Weights Drift: <strong className="text-emerald-700">{b.driftScore}</strong></span>
                  </div>

                  <div className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
                    <strong className="text-slate-700">Asserted Grounding Keywords: </strong>
                    {b.expectedKeywords.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Import Model via Air-Gapped USB */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900">Import Air-Gapped Model Weights</h3>
              </div>
              <button 
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Model Name / Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DeepSeek-R1-Distill-Llama-70B-Q4_K_M"
                  value={importForm.name}
                  onChange={(e) => setImportForm({ ...importForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Parameter Count</label>
                  <select 
                    value={importForm.parameters}
                    onChange={(e) => setImportForm({ ...importForm, parameters: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="14B">14B Parameters</option>
                    <option value="32B">32B Parameters</option>
                    <option value="70B">70B Parameters</option>
                    <option value="72B">72B Parameters</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quantization Format</label>
                  <select
                    value={importForm.quantization}
                    onChange={(e) => setImportForm({ ...importForm, quantization: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="Q4_K_M (GGUF)">Q4_K_M (GGUF)</option>
                    <option value="AWQ 4-bit">AWQ 4-bit (vLLM native)</option>
                    <option value="FP16 Safetensors">FP16 Safetensors</option>
                    <option value="BF16 Safetensors">BF16 Safetensors</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Air-Gapped Source Media</label>
                <input
                  type="text"
                  disabled
                  value={importForm.usbDevice}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Required SHA-256 Checksum</label>
                <input
                  type="text"
                  placeholder="e.g. e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
                  value={importForm.sha256}
                  onChange={(e) => setImportForm({ ...importForm, sha256: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Safetensors Header Validation Enforced</span>
                </div>
                <div>Executable pickle payloads are strictly rejected by the sovereign loader.</div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Verify & Ingest Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
