import React, { useState } from 'react';
import { 
  Layers, ShieldCheck, ArrowDown, Cpu, Database, Server, Lock, Bot, Activity, CheckCircle2
} from 'lucide-react';

interface ArchLayer {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  responsibility: string;
  securityControls: string[];
  technologies: string[];
  status: string;
}

export const ArchitectureVis: React.FC = () => {
  const layers: ArchLayer[] = [
    {
      id: 'ui',
      name: 'User Interface Layer',
      subtitle: 'Responsive Enterprise Dashboard',
      icon: <Layers className="w-5 h-5" />,
      color: 'from-cyan-500 to-blue-500',
      responsibility: 'Renders responsive dashboard UI, mobile drawers, chat interface, document search, and real-time alerts.',
      securityControls: [
        'Client-side Session Encryption',
        'Role-Based View Hiding',
        'CSRF & XSS Context Sanitization'
      ],
      technologies: ['React 19', 'Tailwind CSS', 'Vite', 'Lucide Icons'],
      status: 'ONLINE — ACTIVE'
    },
    {
      id: 'api',
      name: 'API Layer & Gateway',
      subtitle: 'Internal Air-Gapped Router',
      icon: <Server className="w-5 h-5" />,
      color: 'from-blue-500 to-indigo-500',
      responsibility: 'Routes requests to internal microservices over localhost mTLS sockets. Blocks external outbound traffic.',
      securityControls: [
        'Outbound Internet Traffic Killswitch',
        'mTLS Inter-service Auth',
        'Strict Rate Limiting & Throttle'
      ],
      technologies: ['Local Express Gateway', 'gRPC Local Sockets'],
      status: 'ONLINE — AIR-GAPPED'
    },
    {
      id: 'control',
      name: 'Control Layer',
      subtitle: 'RBAC + Policy Engine + Audit Engine',
      icon: <Lock className="w-5 h-5" />,
      color: 'from-purple-500 to-rose-500',
      responsibility: 'Enforces fine-grained Role-Based Access Control, policy toggles, prompt injection sanitization, and cryptographic audit hashing.',
      securityControls: [
        'SHA-256 Document Fingerprint Integrity',
        'Prompt Injection Sanitizer Engine',
        'Mandatory Human Approval Gatekeeper'
      ],
      technologies: ['OPA Policy Rules', 'SHA-256 Audit Ledger', 'RBAC Token Validator'],
      status: 'ENFORCING GUARDBOUNDS'
    },
    {
      id: 'orchestrator',
      name: 'AI Orchestrator',
      subtitle: 'RAG Pipeline + Multi-Agent Engine',
      icon: <Bot className="w-5 h-5" />,
      color: 'from-amber-500 to-orange-500',
      responsibility: 'Retrieves relevant document chunks, constructs citation evidence, calculates confidence scores, and invokes multi-step agent workflows.',
      securityControls: [
        'Evidence Citation Verification',
        'Zero-Hallucination Fallback Trigger',
        'Restricted Knowledge Retrieval Filtering'
      ],
      technologies: ['LangChain Local Pipeline', 'RAG Chunk Indexer', 'Agent Execution Graph'],
      status: 'ONLINE — LOCAL RAG'
    },
    {
      id: 'data',
      name: 'Data Layer',
      subtitle: 'Documents + Vector Search + Database',
      icon: <Database className="w-5 h-5" />,
      color: 'from-emerald-500 to-teal-500',
      responsibility: 'Stores document chunks, vector embeddings, sensor telemetry, and approval records inside local storage.',
      securityControls: [
        'AES-256 On-Disk Encryption',
        'Classification Tagging (Public/Internal/Confidential/Restricted)',
        'Tamper Mismatch Auto-Alerting'
      ],
      technologies: ['Local Vector DB (Milvus/Chroma)', 'SQLite / Local Storage', 'Vector Embeddings'],
      status: 'ONLINE — 12,842 VECTORS'
    },
    {
      id: 'runtime',
      name: 'Local AI Runtime',
      subtitle: 'Sovereign On-Premise Inference Engine',
      icon: <Cpu className="w-5 h-5" />,
      color: 'from-cyan-600 to-emerald-600',
      responsibility: 'Executes GGUF/TensorRT weights locally on air-gapped GPU cluster node without sending 1 byte outside.',
      securityControls: [
        'Complete Offline Hardware Isolation',
        'Zero Cloud Telemetry Transmission'
      ],
      technologies: ['vLLM Local Server', 'Ollama / Llama.cpp', 'Vision Transformer CUDA'],
      status: 'ONLINE — LOCAL HARDWARE'
    },
    {
      id: 'industrial',
      name: 'Industrial Data Assets',
      subtitle: 'Sensors, Pumps, Turbines & SOPs',
      icon: <Activity className="w-5 h-5" />,
      color: 'from-slate-600 to-slate-800',
      responsibility: 'Source machinery, maintenance manuals, thermographic inspection images, and SCADA sensor logs.',
      securityControls: [
        'Read-Only Sensor Ingestion Boundary',
        'No Autonomous Write Back to Machinery'
      ],
      technologies: ['OPC-UA Telemetry Reader', 'Modbus Industrial Interface'],
      status: 'CONNECTED — READ-ONLY'
    }
  ];

  const [selectedLayer, setSelectedLayer] = useState<ArchLayer>(layers[2]); // Default to Control Layer

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-400 mb-1">
            <Layers className="w-4 h-4" /> System Architecture Visualization
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            SovereignForge Security Stack Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Click any architectural layer to inspect responsibilities, security controls, and technologies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
            AIR-GAPPED SYSTEM FLOW
          </span>
        </div>
      </div>

      {/* Interactive Architecture Flow Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Stack Diagram Cards */}
        <div className="lg:col-span-7 space-y-3">
          {layers.map((layer, idx) => {
            const isSelected = selectedLayer.id === layer.id;
            return (
              <React.Fragment key={layer.id}>
                <button
                  onClick={() => setSelectedLayer(layer)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all relative ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/80 shadow-2xl scale-[1.02] glow-cyan'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${layer.color} text-white shadow-md`}>
                      {layer.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm font-mono">{layer.name}</h3>
                      <p className="text-xs text-slate-400">{layer.subtitle}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 text-emerald-400 border border-slate-800">
                      {layer.status.split('—')[0]}
                    </span>
                  </div>
                </button>

                {idx < layers.length - 1 && (
                  <div className="flex justify-center my-1 text-slate-600">
                    <ArrowDown className="w-4 h-4 animate-bounce text-cyan-500/60" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Column: Layer Details Panel */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur sticky top-20">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${selectedLayer.color} text-white shadow-lg`}>
                {selectedLayer.icon}
              </div>
              <div>
                <h3 className="font-bold text-white text-base font-mono">{selectedLayer.name}</h3>
                <span className="text-xs text-emerald-400 font-mono">{selectedLayer.status}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase font-bold text-slate-400">Core Responsibility</h4>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3.5 rounded-2xl border border-slate-800 font-mono">
              {selectedLayer.responsibility}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase font-bold text-slate-400">Security Controls</h4>
            <div className="space-y-1.5">
              {selectedLayer.securityControls.map((sec, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{sec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase font-bold text-slate-400">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {selectedLayer.technologies.map((tech, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono">
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
