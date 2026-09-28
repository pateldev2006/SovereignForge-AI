import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, Bot, Lock, Cpu, Terminal, FileText, CheckCircle2, 
  ArrowRight, Play, Sparkles, ChevronRight, Layers, Database,
  HardDrive, AlertTriangle, FileCheck, Check, Zap, Server, 
  Eye, Code2, Scale, RefreshCw, Activity, ArrowUpRight,
  ExternalLink, Network, CheckSquare, Shield, HelpCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { 
    navigateTo, 
    setIsSovereigntyModalOpen, 
    startDemoTour, 
    currentUser, 
    switchUser 
  } = useApp();

  // State for Interactive 7-Step Pipeline Simulator
  const [activeStepTab, setActiveStepTab] = useState<number>(1);

  // State for Interactive Model Router Playground
  const [activeRouterQuery, setActiveRouterQuery] = useState<number>(0);

  // State for Comparison Tab
  const [comparisonTab, setComparisonTab] = useState<'sovereign' | 'cloud'>('sovereign');

  // 7-Step Pipeline Data
  const PIPELINE_STEPS = [
    {
      step: 1,
      title: 'Document OCR & Layout Table Parsing',
      engine: 'PaddleOCR + Tesseract Engine',
      latency: '140ms',
      badge: 'Local OCR Engine',
      color: 'blue',
      icon: FileText,
      description: 'Ingests complex scanned non-destructive testing (NDT) reports, engineering drawings, and ultrasonic thickness grid tables without external cloud OCR APIs.',
      artifact: 'sample_inspection_report.pdf (Page 4 Grid C4)',
      telemetry: '847 words extracted • 98.4% OCR Confidence • 0 Cloud Packets'
    },
    {
      step: 2,
      title: 'P&ID Computer Vision Grounding',
      engine: 'Qwen2.5-VL-72B-Vision (Air-Gapped)',
      latency: '380ms',
      badge: 'Multimodal VLM',
      color: 'purple',
      icon: Eye,
      description: 'Performs spatial coordinate grounding on high-resolution piping & instrumentation diagrams (P&IDs) to identify nozzle tags, line specs, and relief valve boundaries.',
      artifact: 'P&ID_CDU03_Unit_03.png (Rev C)',
      telemetry: 'Tag HX-204 located at (X:1420, Y:890) • Valve GV-1501 confirmed'
    },
    {
      step: 3,
      title: 'Dense SOP RAG Vector Search',
      engine: 'BAAI BGE-M3 (1024-dim Local Qdrant)',
      latency: '18ms',
      badge: 'Semantic Vector DB',
      color: 'indigo',
      icon: Database,
      description: 'Conducts dense hybrid semantic retrieval against indexed plant operating procedures (SOPs), OISD-STD-129 guidelines, and ASME Section VIII standards.',
      artifact: 'SOP-4.2.1 Rev 4 (§7.1 & §4.3.4)',
      telemetry: '5 chunks retrieved • Cosine similarity 0.941 • On-premise vector store'
    },
    {
      step: 4,
      title: 'API 510 Mathematical Sandbox',
      engine: 'Isolated Python SymPy Engine',
      latency: '24ms',
      badge: 'Secure Code Sandbox',
      color: 'emerald',
      icon: Terminal,
      description: 'Executes corrosion rate equations (CR = (t_init - t_act)/Y) and remaining statutory life calculations in an air-gapped sandboxed runtime without internet dependencies.',
      artifact: 'API 510 Remaining Life: 1.43 yrs',
      telemetry: 'Corrosion Rate: 0.28 mm/yr • Retirement Limit: 7.8 mm (Flagged)'
    },
    {
      step: 5,
      title: 'Statutory SOP Deviation Audit',
      engine: 'DeepSeek-R1-Distill-70B (Local)',
      latency: '410ms',
      badge: 'Reasoning Engine',
      color: 'rose',
      icon: Scale,
      description: 'Audits proposed turnaround schedules against mandatory sour crude limits. Automatically flags compliance variances before human sign-off.',
      artifact: '⚠️ +6M Overhaul Variance Flagged',
      telemetry: '18-mo proposal violates 12-mo limit in SOP-4.2.1 §7.1 • Risk Level: HIGH'
    },
    {
      step: 6,
      title: 'Formal Approval Note Synthesis',
      engine: 'Qwen-2.5-72B-Instruct (Air-Gapped)',
      latency: '620ms',
      badge: 'Executive Synthesizer',
      color: 'sky',
      icon: FileCheck,
      description: 'Synthesizes executive sign-off drafts formatted per engineering standards with sentence-level verifiable citations linked directly to verified local sources.',
      artifact: 'MECH/2026/HX-204-APPR Draft',
      telemetry: '3-point executive note generated • 100% cited • Zero hallucinations'
    },
    {
      step: 7,
      title: 'Hardware SHA-256 Ledger Attestation',
      engine: 'FIPS-140-3 Hardware HSM Root of Trust',
      latency: '8ms',
      badge: 'Cryptographic Ledger',
      color: 'amber',
      icon: Lock,
      description: 'Seals every synthesized draft, calculation log, and model decision with a tamper-evident SHA-256 cryptographic signature stored in the forensic audit ledger.',
      artifact: '0x7F8A9B2C3D4E5F60718293A4B5C6',
      telemetry: 'Immutable seal applied • Egress invariant verified: 0 bytes'
    }
  ];

  // Router Interactive Queries
  const ROUTER_QUERIES = [
    {
      query: 'Draft an approval note for the corrosion findings. Check against our SOPs.',
      taskType: 'Multi-Step Autonomous Agent & Statutory Compliance',
      routedModel: 'DeepSeek-R1 + Qwen-2.5-72B',
      reasoning: 'Requires complex multi-step reasoning, regulatory discrepancy detection, and formal engineering prose synthesis.',
      gpuCluster: '4x NVIDIA H100 SXM5 (Local)',
      vram: '42.4 GB / 320 GB',
      egress: '0 Outbound Packets'
    },
    {
      query: 'Write a Python script to calculate remaining wall thickness and flag anything below 7.8mm.',
      taskType: 'Mathematical Sandbox & Code Generation',
      routedModel: 'Qwen2.5-Coder-32B-Instruct',
      reasoning: 'Requires deterministic syntax generation, NumPy array vectorization, and isolated sandbox execution verification.',
      gpuCluster: '2x NVIDIA H100 SXM5 (Local)',
      vram: '19.8 GB / 320 GB',
      egress: '0 Outbound Packets'
    },
    {
      query: 'What is the valve tag on line 6"-CS-1501 near the unit battery limit?',
      taskType: 'Multimodal P&ID Drawing Computer Vision',
      routedModel: 'Qwen2.5-VL-72B-Vision',
      reasoning: 'Requires high-resolution spatial symbol recognition on engineering DWG/PNG schematics and tag OCR.',
      gpuCluster: '4x NVIDIA H100 SXM5 (Local)',
      vram: '44.1 GB / 320 GB',
      egress: '0 Outbound Packets'
    },
    {
      query: 'What is the mandatory inspection interval for Class C corrosion under sour service?',
      taskType: 'Dense Vector Document Lookup & RAG',
      routedModel: 'Qwen-2.5-14B + BAAI BGE-M3',
      reasoning: 'Fast single-turn semantic search over indexed engineering standards and statutory guidelines.',
      gpuCluster: '1x NVIDIA H100 SXM5 (Local)',
      vram: '9.2 GB / 320 GB',
      egress: '0 Outbound Packets'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* ═══ TOP AIR-GAP TELEMETRY BANNER ═══ */}
      <div className="bg-slate-950 border-b border-slate-800 text-[11px] font-mono py-1.5 px-4 text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-bold">AIR-GAP ACTIVE:</span>
            <span>0 Outbound Egress</span>
            <span className="text-slate-600">•</span>
            <span>Physical Network Isolation: <strong className="text-slate-200">VERIFIED</strong></span>
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <span>GPU CLUSTER: <strong className="text-white">4x NVIDIA H100 SXM5</strong></span>
            <span className="text-slate-600">•</span>
            <span>HARDWARE HSM: <strong className="text-emerald-400">FIPS 140-3</strong></span>
            <button
              onClick={() => setIsSovereigntyModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
            >
              View Telemetry ↗
            </button>
          </div>
        </div>
      </div>

      {/* ═══ NAVIGATION HEADER ═══ */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white tracking-tight text-lg leading-none">
                  SOVEREIGNFORGE<span className="text-blue-500">.AI</span>
                </span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                  AIR-GAPPED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none mt-1">
                Industrial Agentic AI for Critical Infrastructure
              </p>
            </div>
          </div>

          {/* Center Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a href="#pipeline" className="hover:text-blue-400 transition-colors">7-Step Agent</a>
            <a href="#router" className="hover:text-blue-400 transition-colors">Dynamic Router</a>
            <a href="#governance" className="hover:text-blue-400 transition-colors">Enterprise RBAC</a>
            <a href="#architecture" className="hover:text-blue-400 transition-colors">Air-Gap Security</a>
            <a href="#comparison" className="hover:text-blue-400 transition-colors">Why SovereignForge</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={startDemoTour}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Judge Demo Tour</span>
            </button>

            <button
              onClick={() => navigateTo('workbench')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Launch AI Workbench</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Top Pill */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              <span className="font-mono text-[11px] font-bold text-blue-400">100% ON-PREMISE AI</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300">Deterministic Provenance for Refineries & Heavy Engineering</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Deterministic Agentic AI for <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Heavy Engineering Complexes
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto font-normal">
              Autonomous multi-model reasoning with <strong>zero external cloud calls</strong>. Ingest scanned NDT surveys, 
              inspect high-resolution P&ID schematics, verify API 510 thickness decay, and synthesize formal statutory 
              SOP approval notes with sentence-level cryptographic provenance.
            </p>

            {/* CTA Buttons */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigateTo('workbench')}
                className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/40 transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Launch Industrial AI Workbench</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsSovereigntyModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verify Air-Gap Invariant</span>
              </button>

              <button
                onClick={() => navigateTo('code-sandbox')}
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-blue-400" />
                <span>Open Code Sandbox</span>
              </button>
            </div>

            {/* Industrial Compliance Badges */}
            <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>OISD-STD-129 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>ASME Sec VIII Div 1 & 2</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>API 510 Pressure Vessel Calculations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>FIPS 140-3 Hardware HSM</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>0 Outbound Internet Calls</span>
              </div>
            </div>

          </div>

          {/* ═══ LIVE HERO INTERACTIVE PREVIEW CARD ═══ */}
          <div className="mt-14 rounded-2xl bg-slate-950 border-2 border-slate-800 shadow-2xl p-4 sm:p-6 max-w-5xl mx-auto relative overflow-hidden">
            
            {/* Terminal Window Chrome */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                </div>
                <span className="text-slate-500 ml-2">sovereignforge-agent-runtime.local:8080</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300 font-bold text-[10px]">
                  🧠 ROUTER: DeepSeek-R1 + Qwen-72B
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold text-[10px]">
                  ● 0 EGRESS
                </span>
              </div>
            </div>

            {/* Interactive Preview Content */}
            <div className="pt-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Live Agent Execution Stream */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-blue-400">
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>AUTONOMOUS EXECUTION TRACE (7/7 STEPS COMPLETE)</span>
                  </span>
                  <span className="text-slate-400 text-[10px]">⏱️ 12.4s TOTAL</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-200">1. PaddleOCR Table Extraction</strong>
                        <span className="text-slate-500 text-[10px]">140ms</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">Extracted Heat Exchanger HX-204 shell grid C4: 8.2 mm</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-200">2. Qwen2.5-VL-72B Vision Spatial Scan</strong>
                        <span className="text-slate-500 text-[10px]">380ms</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">Grounded nozzle N2 and valve GV-1501 on Line 6"-CS-1501</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-200">3. Python SymPy Sandbox Verification</strong>
                        <span className="text-slate-500 text-[10px]">24ms</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">Corrosion rate: 0.28 mm/yr • Remaining life: 1.43 years</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/80 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">!</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-rose-300">4. DeepSeek-R1 Statutory Audit</strong>
                        <span className="text-rose-400 text-[10px]">410ms</span>
                      </div>
                      <p className="text-[11px] text-rose-200 font-sans">⚠️ SOP Deviation: Proposed 18-mo turnaround violates 12-mo sour crude limit (SOP-4.2.1 §7.1)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Synthesized Output */}
              <div className="lg:col-span-5 bg-slate-900 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-blue-400" />
                      Synthesized Approval Note
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                      100% CITED
                    </span>
                  </div>

                  <div className="pt-3 text-[11px] font-sans text-slate-300 space-y-2 leading-relaxed">
                    <p className="font-bold text-white">
                      FORMAL TECHNICAL APPROVAL NOTE — CORROSION FINDINGS
                    </p>
                    <p>
                      <strong className="text-blue-300">1. Executive Summary:</strong> Ultrasonic thickness survey on Heat Exchanger HX-204 shell reveals minimum wall thickness of <strong className="text-white">8.2 mm [1]</strong> against retirement limit 7.8 mm.
                    </p>
                    <p>
                      <strong className="text-amber-300">2. SOP Non-Conformance:</strong> Proposed field 18-month turnaround interval violates the 12-month limit mandated by <strong className="text-white">SOP-4.2.1 §7.1 [2]</strong> for sour crude service.
                    </p>
                    <p>
                      <strong className="text-emerald-300">3. Recommendation:</strong> Advance turnaround window to <strong className="text-white">Q1 2027</strong> with pre-allocated bundle procurement per <strong className="text-white">SOP-4.2.1 §4.3.4 [3]</strong>.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="font-mono text-[9px] text-slate-500">
                    SHA-256: <span className="text-emerald-400">0x7F8A9B...</span>
                  </div>
                  <button
                    onClick={() => navigateTo('workbench')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Open in Studio</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ═══ SECTION 2: 7-STEP AGENT PIPELINE WALKTHROUGH ═══ */}
      <section id="pipeline" className="py-20 bg-slate-950 border-t border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800 px-3 py-1 rounded-full">
              END-TO-END AUTONOMOUS ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
              The 7-Step Autonomous Industrial Agent Pipeline
            </h2>
            <p className="mt-3 text-slate-400 text-sm leading-relaxed">
              Every query executes across a coordinated multi-model pipeline on local GPU infrastructure, 
              from computer vision parsing to cryptographic attestation.
            </p>
          </div>

          {/* Interactive Step Navigator */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Step Selection List */}
            <div className="lg:col-span-5 space-y-2">
              {PIPELINE_STEPS.map((st) => {
                const isSelected = activeStepTab === st.step;
                const IconComponent = st.icon;
                return (
                  <div
                    key={st.step}
                    onClick={() => setActiveStepTab(st.step)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                        : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {st.step}
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold ${isSelected ? 'text-white font-extrabold' : 'text-slate-300'}`}>
                          {st.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {st.engine}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {st.latency}
                      </span>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-600'}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step Detail Card */}
            <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl relative min-h-[420px] flex flex-col justify-between">
              {(() => {
                const current = PIPELINE_STEPS.find(s => s.step === activeStepTab) || PIPELINE_STEPS[0];
                const IconComp = current.icon;
                return (
                  <div className="space-y-6">
                    <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                          <IconComp className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-blue-400">STEP {current.step} OF 7</span>
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                              {current.badge}
                            </span>
                          </div>
                          <h3 className="text-lg font-black text-white mt-0.5">{current.title}</h3>
                        </div>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <span className="text-emerald-400 font-bold block">{current.latency}</span>
                        <span className="text-[10px] text-slate-500">Inference Latency</span>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-xs font-mono uppercase font-bold text-slate-400 mb-2">Architectural Function:</h5>
                      <p className="text-sm text-slate-300 leading-relaxed font-sans">
                        {current.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block mb-1">Active Artifact:</span>
                        <span className="text-xs font-mono font-semibold text-blue-300">{current.artifact}</span>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block mb-1">Local Neural Engine:</span>
                        <span className="text-xs font-mono font-semibold text-purple-300">{current.engine}</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/60 rounded-xl text-xs font-mono text-emerald-300 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{current.telemetry}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded font-bold">
                        VERIFIED
                      </span>
                    </div>
                  </div>
                );
              })()}

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">Simulate complete 90s sequence in AI Workbench</span>
                <button
                  onClick={() => navigateTo('workbench')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>Run Live Agent</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ═══ SECTION 3: DYNAMIC AIR-GAPPED MODEL ROUTER ═══ */}
      <section id="router" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 bg-purple-950/80 border border-purple-800 px-3 py-1 rounded-full">
              ZERO-EGRESS WORKLOAD DISPATCH
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
              Dynamic Air-Gapped Model Router
            </h2>
            <p className="mt-3 text-slate-400 text-sm leading-relaxed">
              No single model handles every task. SovereignForge's on-premise router dynamically analyzes 
              intent and dispatches workloads to specialized neural weights on the local cluster.
            </p>
          </div>

          {/* Interactive Router Playground */}
          <div className="mt-12 bg-slate-950 rounded-2xl border-2 border-slate-800 p-6 sm:p-8">
            
            <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-4">
              Select Sample Query to Inspect Routing Decision:
            </h4>

            {/* Query Selector Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {ROUTER_QUERIES.map((rq, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveRouterQuery(idx)}
                  className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    activeRouterQuery === idx
                      ? 'bg-purple-950/50 border-purple-500 text-white ring-1 ring-purple-500'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-purple-400">Query {idx + 1}</span>
                    <span className="text-[10px] font-mono text-slate-500">{rq.taskType.split('&')[0]}</span>
                  </div>
                  <p className="font-semibold text-slate-200 line-clamp-2">"{rq.query}"</p>
                </button>
              ))}
            </div>

            {/* Active Routing Analysis Card */}
            {(() => {
              const selected = ROUTER_QUERIES[activeRouterQuery];
              return (
                <div className="bg-slate-900 rounded-xl p-6 border border-purple-900/60 space-y-6">
                  
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-purple-400 block">Classified Task Intent:</span>
                      <h3 className="text-base font-extrabold text-white mt-0.5">{selected.taskType}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-purple-950 border border-purple-700 text-purple-300 font-mono font-bold text-xs flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-purple-400" />
                        <span>{selected.routedModel}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono font-bold text-xs">
                        0 EGRESS
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">Routing Rationale:</span>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">{selected.reasoning}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block mb-0.5">Hardware Allocation:</span>
                      <strong className="text-slate-200">{selected.gpuCluster}</strong>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block mb-0.5">VRAM Allocation:</span>
                      <strong className="text-purple-300">{selected.vram}</strong>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block mb-0.5">Network Invariant:</span>
                      <strong className="text-emerald-400">{selected.egress}</strong>
                    </div>
                  </div>

                </div>
              );
            })()}

          </div>

        </div>
      </section>

      {/* ═══ SECTION 4: 6 CORE ENTERPRISE PILLARS ═══ */}
      <section id="governance" className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full">
              ENTERPRISE-GRADE CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
              Engineered for High-Reliability Operations
            </h2>
            <p className="mt-3 text-slate-400 text-sm leading-relaxed">
              Designed specifically for industrial plant safety, regulatory compliance, and non-negotiable security standards.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-white">100% Air-Gapped Physical Isolation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero network egress to cloud APIs. All model weights, embeddings, and vector indices operate entirely within on-premise data center boundaries.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-white">Strict Sentence-Level Provenance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Eliminates hallucinations. Every single claim is explicitly anchored to line items, drawing coordinates, or statutory SOP clauses with confidence ratings.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-white">Isolated Python Math Sandbox</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Executes API 510 remaining life, corrosion decay rates, and structural safety margins in a secure runtime with full tabular visualization.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-white">Retractable Deliverable Studio</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant multi-format artifact export directly to Word (.docx), Signed PDF, Excel (.xlsx), and Python (.py) with inline direct editing capabilities.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-white">5-Role Enterprise RBAC Matrix</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tailored views and security gates for Plant Engineers, QA Officers, Approving Authorities, IT Engineers, and Chief Information Security Officers.
              </p>
            </div>

            {/* Pillar 6 */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-white">Immutable Forensic Audit Ledger</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hardware HSM cryptographically seals every prompt, intermediate tool call, and generated draft with SHA-256 tamper-evident timestamps.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ═══ SECTION 5: SOVEREIGNFORGE VS CLOUD AI COMPARISON ═══ */}
      <section id="comparison" className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800 px-3 py-1 rounded-full">
              SECURITY & RELIABILITY BENCHMARK
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
              Why SovereignForge for Critical Infrastructure?
            </h2>
            <p className="mt-3 text-slate-400 text-sm leading-relaxed">
              Comparing on-premise air-gapped engineering intelligence against public cloud LLM services.
            </p>
          </div>

          <div className="mt-12 bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 font-mono text-[11px] text-slate-400">
                  <th className="p-4">EVALUATION DIMENSION</th>
                  <th className="p-4 text-emerald-400 font-bold bg-emerald-950/30">
                    🛡️ SOVEREIGNFORGE AI (AIR-GAPPED)
                  </th>
                  <th className="p-4 text-slate-400">
                    ☁️ PUBLIC CLOUD AI (OPENAI / ANTHROPIC)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="p-4 font-bold text-white">Network Egress & Data Privacy</td>
                  <td className="p-4 text-emerald-300 font-semibold bg-emerald-950/20 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>0 bytes egress • 100% on-premise</span>
                  </td>
                  <td className="p-4 text-rose-400">Requires uploading proprietary drawings to cloud APIs</td>
                </tr>

                <tr>
                  <td className="p-4 font-bold text-white">Hallucination Mitigation</td>
                  <td className="p-4 text-emerald-300 font-semibold bg-emerald-950/20">
                    Strict sentence-level provenance & confidence %
                  </td>
                  <td className="p-4 text-rose-400">Probabilistic text generation without provenance guarantees</td>
                </tr>

                <tr>
                  <td className="p-4 font-bold text-white">Engineering Math & Physics</td>
                  <td className="p-4 text-emerald-300 font-semibold bg-emerald-950/20">
                    Isolated SymPy code sandbox (API 510 formula verified)
                  </td>
                  <td className="p-4 text-rose-400">LLM token-prediction math prone to calculation drift</td>
                </tr>

                <tr>
                  <td className="p-4 font-bold text-white">High-Resolution P&ID Computer Vision</td>
                  <td className="p-4 text-emerald-300 font-semibold bg-emerald-950/20">
                    Qwen2.5-VL-72B @ 2400x1800 native resolution
                  </td>
                  <td className="p-4 text-slate-400">Cloud tile downsampling loses small valve tags</td>
                </tr>

                <tr>
                  <td className="p-4 font-bold text-white">Statutory Non-Conformance Flagging</td>
                  <td className="p-4 text-emerald-300 font-semibold bg-emerald-950/20">
                    DeepSeek-R1 rule-based audit against OISD / SOPs
                  </td>
                  <td className="p-4 text-slate-400">General responses without statutory boundary enforcement</td>
                </tr>

                <tr>
                  <td className="p-4 font-bold text-white">Tamper-Evident Auditability</td>
                  <td className="p-4 text-emerald-300 font-semibold bg-emerald-950/20">
                    FIPS 140-3 Hardware HSM SHA-256 cryptographic seal
                  </td>
                  <td className="p-4 text-rose-400">Ephemeral chat logs without cryptographic attestation</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* ═══ SECTION 6: READY TO EVALUATE CTA ═══ */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-2xl shadow-blue-600/50">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Experience Air-Gapped Industrial AI?
          </h2>

          <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
            Test the live 7-step autonomous agent pipeline, inspect the dynamic model router, 
            and evaluate the retractable Deliverable Studio on our production prototype.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigateTo('workbench')}
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/40 transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <Bot className="w-5 h-5" />
              <span>Launch AI Workbench</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={startDemoTour}
              className="px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Start Judge Demo Tour</span>
            </button>
          </div>

        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-12 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-300 text-sm">
              SOVEREIGNFORGE<span className="text-blue-500">.AI</span>
            </span>
            <span className="text-slate-600">•</span>
            <span>Enterprise Air-Gapped Industrial Agentic AI Workbench</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => navigateTo('workbench')} className="hover:text-slate-300 cursor-pointer">AI Task Composer</button>
            <button onClick={() => navigateTo('code-sandbox')} className="hover:text-slate-300 cursor-pointer">Code Sandbox</button>
            <button onClick={() => navigateTo('reviews')} className="hover:text-slate-300 cursor-pointer">P&ID Review</button>
            <button onClick={() => setIsSovereigntyModalOpen(true)} className="text-emerald-400 hover:underline cursor-pointer">Zero Egress Audit</button>
          </div>

          <div className="w-full text-center sm:text-right text-[10px] text-slate-600 pt-4 border-t border-slate-900">
            © 2026 SovereignForge AI. All rights reserved. 100% Sovereign On-Premise Operations.
          </div>

        </div>
      </footer>

    </div>
  );
};
