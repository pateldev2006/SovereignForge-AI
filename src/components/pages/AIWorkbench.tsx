import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, Play, UploadCloud, CheckCircle2, AlertTriangle, 
  ArrowRight, ShieldCheck, Cpu, RefreshCw, ExternalLink, 
  Clock, Sparkles, Check, ChevronDown, ChevronUp, Download, Send, 
  Layers, Eye, FileCheck, FileText, FileSpreadsheet, Image as ImageIcon,
  Activity, Zap, Compass, Flame, CheckSquare
} from 'lucide-react';
import { downloadApprovalNotePDF } from '../../utils/exportUtils';

export const AIWorkbench: React.FC = () => {
  const { 
    currentUser, 
    currentTask, 
    runAgentTask, 
    isAgentRunning, 
    agentProgressStep,
    openSourceViewer,
    resetTaskToFresh,
    navigateTo,
    showToast
  } = useApp();

  // Composer Form State
  const [promptInput, setPromptInput] = useState<string>(
    'Prepare approval note for Heat Exchanger HX-204 and check against relevant SOPs.'
  );
  const [selectedFiles, setSelectedFiles] = useState<string[]>([
    'inspection_report.pdf',
    'SOP_4.2.1.pdf',
    'P&ID_Unit_03.png',
    'inspection_photo.jpg'
  ]);
  const [isTraceExpanded, setIsTraceExpanded] = useState<boolean>(true);
  const [isRAGExpanded, setIsRAGExpanded] = useState<boolean>(true);

  // Quick Preset Handlers
  const handleSelectPreset = (presetText: string, files: string[]) => {
    setPromptInput(presetText);
    setSelectedFiles(files);
  };

  const handleToggleFile = (fileName: string) => {
    if (selectedFiles.includes(fileName)) {
      setSelectedFiles(selectedFiles.filter(f => f !== fileName));
    } else {
      setSelectedFiles([...selectedFiles, fileName]);
    }
  };

  const handleRun = () => {
    if (selectedFiles.length === 0) {
      showToast('No Files Attached', 'Please select at least one document for the agent to analyze.', 'warning');
      return;
    }
    runAgentTask(promptInput, selectedFiles);
  };

  const handleSendForApproval = () => {
    showToast(
      'Dispatched to Approver Queue',
      'Technical Approval Note MRPL/MECH/2026/HX-204-APPR submitted for executive review.',
      'success'
    );
  };

  const handleExportDOCX = () => {
    if (currentTask?.deliverable) {
      downloadApprovalNotePDF(currentTask.deliverable, currentUser.name);
      showToast(
        'Exporting Technical Note PDF',
        `Generated signed deliverable ${currentTask.deliverable.referenceNumber}.`,
        'success'
      );
    }
  };

  return (
    <div className="p-4 lg:p-7 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* 1. TOP METRICS STRIP (Crisp Enterprise Design) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Metric 1 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Tasks</span>
            <CheckSquare className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-mono font-extrabold text-slate-900 leading-none block">12</span>
            <span className="text-[10px] text-blue-600 font-semibold mt-1 block">3 awaiting input</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-mono font-extrabold text-amber-600 leading-none block">4</span>
            <span className="text-[10px] text-amber-700 font-semibold mt-1 block">1 Critical SOP dev</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Docs Ingested</span>
            <FileText className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-mono font-extrabold text-slate-900 leading-none block">48</span>
            <span className="text-[10px] text-slate-500 font-semibold mt-1 block">Air-gapped OCR</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">AI Tasks Done</span>
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-mono font-extrabold text-slate-900 leading-none block">31</span>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">100% On-Prem</span>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Verification</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-mono font-extrabold text-emerald-600 leading-none block">96%</span>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Zero hallucination</span>
          </div>
        </div>

        {/* Metric 6 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">System Health</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 leading-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Operational
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">42ms latency</span>
          </div>
        </div>

      </div>

      {/* 2. HERO TASK COMPOSER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        
        {/* Composer Hero Banner */}
        <div className="bg-slate-900 text-white p-6 relative overflow-hidden border-b border-slate-800">
          
          {/* Subtle Industrial Grid Background Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  AUTONOMOUS MULTI-STEP AGENT
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> AIR-GAPPED MRPL LOCAL NODE
                </span>
              </div>
              <h1 className="text-xl lg:text-2xl font-black text-white mt-2.5 tracking-tight">
                What would you like SovereignForge AI to do?
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Ingest refinery inspection reports, drawings, or photos. The system cross-references internal SOPs, detects non-conformance deviations, and prepares formal engineering deliverables.
              </p>
            </div>

            {/* Quick Demo Trigger */}
            <button
              onClick={() => {
                handleSelectPreset(
                  'Prepare approval note for Heat Exchanger HX-204 and check against relevant SOPs.',
                  ['inspection_report.pdf', 'SOP_4.2.1.pdf', 'P&ID_Unit_03.png', 'inspection_photo.jpg']
                );
                handleRun();
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-102 border border-blue-400/30"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>⚡ One-Click Hero Scenario Demo</span>
            </button>
          </div>
        </div>

        {/* Composer Body */}
        <div className="p-6 space-y-5">
          
          {/* Text Instruction Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Engineering Task Instructions & Directives
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Press Ctrl + Enter to run</span>
            </div>
            <textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === 'Enter') handleRun();
              }}
              placeholder="E.g., Ingest the Q3 inspection report for Heat Exchanger HX-204, compare observed wall thickness and turnaround interval with SOP-4.2.1, detect deviations, and draft a formal approval note..."
              rows={2}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-sans leading-relaxed resize-none font-medium"
            />
          </div>

          {/* Quick Preset Chips */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Industrial Task Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSelectPreset(
                  'Prepare approval note for Heat Exchanger HX-204 and check against relevant SOPs.',
                  ['inspection_report.pdf', 'SOP_4.2.1.pdf', 'P&ID_Unit_03.png', 'inspection_photo.jpg']
                )}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all text-left flex items-center gap-1.5 ${
                  promptInput.includes('HX-204')
                    ? 'bg-blue-50 border-blue-300 text-blue-800 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>⚡ Heat Exchanger HX-204 NDT & SOP-4.2.1 Audit</span>
              </button>

              <button
                onClick={() => handleSelectPreset(
                  'Audit P&ID Unit 03 relief valve PSV-304 setpoint against OISD-STD-129 and crude pre-heat line rating.',
                  ['P&ID_Unit_03.png', 'SOP_4.2.1.pdf']
                )}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all text-left flex items-center gap-1.5 ${
                  promptInput.includes('PSV-304')
                    ? 'bg-blue-50 border-blue-300 text-blue-800 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>🔍 P&ID Unit 03 Relief Line Sizing & PSV Audit</span>
              </button>

              <button
                onClick={() => handleSelectPreset(
                  'Compare L&T Turnaround Vendor Bid line items against MRPL Standard Scope Matrix and warranty terms.',
                  ['vendor_bid.xlsx', 'SOP_4.2.1.pdf']
                )}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all text-left flex items-center gap-1.5 ${
                  promptInput.includes('Vendor Bid')
                    ? 'bg-blue-50 border-blue-300 text-blue-800 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>📊 Vendor Turnaround Quotation & Scope Analysis</span>
              </button>
            </div>
          </div>

          {/* Document Ingestion & Attachment Shelf */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                Attached Industrial Documents ({selectedFiles.length} Selected)
              </label>
              <span className="text-[10px] text-slate-500">Click card to include / exclude from context</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              
              {/* Document 1: Inspection Report */}
              <div 
                onClick={() => handleToggleFile('inspection_report.pdf')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedFiles.includes('inspection_report.pdf')
                    ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px]">
                      PDF
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-tight truncate max-w-[130px]">inspection_report.pdf</h4>
                      <span className="text-[10px] text-slate-500 font-mono">4.2 MB • HX-204</span>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedFiles.includes('inspection_report.pdf') ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                  }`}>
                    {selectedFiles.includes('inspection_report.pdf') && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
                <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center gap-1.5 text-[9px] text-emerald-700 font-semibold">
                  <span>✓ OCR done</span>
                  <span>•</span>
                  <span>✓ NDT tables</span>
                </div>
              </div>

              {/* Document 2: SOP-4.2.1 */}
              <div 
                onClick={() => handleToggleFile('SOP_4.2.1.pdf')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedFiles.includes('SOP_4.2.1.pdf')
                    ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                      SOP
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-tight truncate max-w-[130px]">SOP_4.2.1.pdf</h4>
                      <span className="text-[10px] text-slate-500 font-mono">2.8 MB • Standard</span>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedFiles.includes('SOP_4.2.1.pdf') ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                  }`}>
                    {selectedFiles.includes('SOP_4.2.1.pdf') && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
                <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center gap-1.5 text-[9px] text-emerald-700 font-semibold">
                  <span>✓ Vector indexed</span>
                  <span>•</span>
                  <span>✓ Rev 4.2</span>
                </div>
              </div>

              {/* Document 3: P&ID Unit 03 */}
              <div 
                onClick={() => handleToggleFile('P&ID_Unit_03.png')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedFiles.includes('P&ID_Unit_03.png')
                    ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px]">
                      PNG
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-tight truncate max-w-[130px]">P&ID_Unit_03.png</h4>
                      <span className="text-[10px] text-slate-500 font-mono">5.1 MB • Schematic</span>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedFiles.includes('P&ID_Unit_03.png') ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                  }`}>
                    {selectedFiles.includes('P&ID_Unit_03.png') && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
                <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center gap-1.5 text-[9px] text-emerald-700 font-semibold">
                  <span>✓ Vision OCR</span>
                  <span>•</span>
                  <span>✓ Vector tags</span>
                </div>
              </div>

              {/* Document 4: Inspection Photo */}
              <div 
                onClick={() => handleToggleFile('inspection_photo.jpg')}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedFiles.includes('inspection_photo.jpg')
                    ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px]">
                      JPG
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-tight truncate max-w-[130px]">inspection_photo.jpg</h4>
                      <span className="text-[10px] text-slate-500 font-mono">3.4 MB • Gasket Pit</span>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedFiles.includes('inspection_photo.jpg') ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                  }`}>
                    {selectedFiles.includes('inspection_photo.jpg') && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
                <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center gap-1.5 text-[9px] text-emerald-700 font-semibold">
                  <span>✓ Visual scan</span>
                  <span>•</span>
                  <span>✓ Pitting tag</span>
                </div>
              </div>

            </div>
          </div>

          {/* Action Bar & AI Model Router Indicator */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            
            {/* Automatic AI Router Indicator */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">AI ROUTER:</span>
                  <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded border border-blue-200">
                    Qwen2.5-VL-7B (Vision) + R1-Distill (Reasoning)
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Task classified as <strong className="text-slate-700">Multimodal Document & SOP Compliance</strong> (Local On-Prem GPU).
                </p>
              </div>
            </div>

            {/* Execute & Reset Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={resetTaskToFresh}
                className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Clear
              </button>

              <button
                onClick={handleRun}
                disabled={isAgentRunning}
                className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all ${
                  isAgentRunning
                    ? 'bg-blue-400 text-white cursor-wait'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                }`}
              >
                {isAgentRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Pipeline ({agentProgressStep}/7)...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Run Sovereign Agent</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* 3. AGENT EXECUTION TRACE ACCORDION */}
      {currentTask && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          
          <div 
            onClick={() => setIsTraceExpanded(!isTraceExpanded)}
            className="p-4.5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-slate-900 text-xs tracking-tight">AGENT EXECUTION TRACE</h2>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 7/7 STEPS COMPLETED
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    12.4s Execution
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Deterministic audit trace across local OCR, dense embeddings, and reasoning models
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-xs font-semibold text-slate-600">{isTraceExpanded ? 'Collapse' : 'Expand'}</span>
              {isTraceExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>

          {isTraceExpanded && (
            <div className="p-5 bg-slate-50/40 divide-y divide-slate-100">
              {currentTask.agentSteps.map((step) => {
                const isStepFinished = agentProgressStep >= step.stepNumber;
                return (
                  <div key={step.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3.5">
                    <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                      <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center font-mono text-[11px] font-bold ${
                        isStepFinished
                          ? step.status === 'warning' 
                            ? 'bg-amber-500 text-white' 
                            : 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isStepFinished ? (step.status === 'warning' ? '!' : '✓') : step.stepNumber}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900">{step.name}</h4>
                          <span className="text-[9px] font-mono text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                            {step.model}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="text-slate-400 text-[10px]">{step.durationMs}ms</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            step.status === 'warning'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {step.outputSummary}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        {step.details}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* 4. HYBRID MULTIMODAL RAG RETRIEVAL */}
      {currentTask && currentTask.retrievedSources.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          
          <div 
            onClick={() => setIsRAGExpanded(!isRAGExpanded)}
            className="p-4.5 border-b border-slate-200 bg-blue-50/40 flex items-center justify-between cursor-pointer hover:bg-blue-50/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-slate-900 text-xs tracking-tight">HYBRID MULTIMODAL RAG RETRIEVAL</h2>
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                    3 Authoritative Sources Locked
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Dense Vector (BGE-M3) + Sparse BM25 + Cross-Encoder Re-Ranking (BGE-Reranker-v2)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-xs font-semibold text-slate-600">{isRAGExpanded ? 'Collapse' : 'Expand'}</span>
              {isRAGExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>

          {isRAGExpanded && (
            <div className="p-5 space-y-4">
              
              {/* Visual Pipeline Architecture Graph */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
                <div className="flex items-center justify-between min-w-[620px] text-xs font-mono font-bold text-slate-700">
                  <div className="p-2 bg-white rounded border border-slate-300 text-center">
                    <span className="text-[11px]">USER QUERY</span>
                    <span className="text-[9px] text-slate-400 block font-normal">Intent Parsed</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                  <div className="p-2 bg-blue-50 rounded-lg border border-blue-200 text-center">
                    <span className="text-blue-900 text-[11px] font-bold block">HYBRID SEARCH</span>
                    <span className="text-[9px] text-blue-700 font-normal">Vector (BGE-M3) • BM25 • Graph</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                  <div className="p-2 bg-purple-50 rounded border border-purple-200 text-center text-purple-900">
                    <span className="text-[11px]">CROSS RE-RANK</span>
                    <span className="text-[9px] text-purple-600 block font-normal">BGE-Reranker-v2</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                  <div className="p-2 bg-emerald-50 rounded border border-emerald-200 text-center text-emerald-900">
                    <span className="text-[11px]">TOP 3 CONTEXT</span>
                    <span className="text-[9px] text-emerald-600 block font-normal">Anchored Sources</span>
                  </div>
                </div>
              </div>

              {/* Retrieved Sources Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentTask.retrievedSources.map((source) => (
                  <div 
                    key={source.id} 
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="citation-badge">
                          [{source.citationIndex}]
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {source.relevanceScore}% Match
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 leading-snug">{source.documentTitle}</h4>
                      <p className="text-[10px] text-blue-700 font-semibold mt-0.5">
                        Page {source.pageNumber} • {source.sectionTitle}
                      </p>

                      <p className="text-[11px] text-slate-600 mt-2 font-serif italic line-clamp-3 bg-white p-2 rounded border border-slate-200/80">
                        "{source.exactExcerpt}"
                      </p>
                    </div>

                    <button
                      onClick={() => openSourceViewer(source.citationIndex)}
                      className="mt-3 w-full py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-300 text-[11px] font-bold text-blue-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Provenance Source [{source.citationIndex}]</span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      )}

      {/* 5. HERO SOP DEVIATION DETECTED ALERT */}
      {currentTask && currentTask.deviations.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-400 rounded-2xl p-5 shadow-sm animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-200 text-rose-900 border border-rose-300">
                    CRITICAL SOP DEVIATION DETECTED
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-rose-800 border border-rose-200">
                    Human Review Required
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-rose-950 mt-1">
                  Heat Exchanger HX-204 Overhaul Schedule Variance (+6 Months)
                </h3>
                <p className="text-xs text-rose-800/90 mt-0.5 max-w-3xl leading-relaxed">
                  The field inspection report proposed a next turnaround interval of 18 months, which directly violates the 12-month maximum frequency mandated by MRPL SOP-4.2.1 for sour crude service.
                </p>
              </div>
            </div>

            <button
              onClick={() => openSourceViewer(1)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Inspect Source Comparison</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Deviation Variance Comparison Grid */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-xl border border-rose-200 shadow-2xs">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Observed Proposal</span>
              <div className="text-base font-bold text-rose-700 mt-0.5">18 Months</div>
              <span className="text-[10px] text-slate-600 font-medium block">
                inspection_report.pdf — Page 4 <button onClick={() => openSourceViewer(2)} className="text-blue-600 font-bold hover:underline">[2]</button>
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-rose-200 shadow-2xs">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Mandatory Standard</span>
              <div className="text-base font-bold text-emerald-700 mt-0.5">12 Months (Max)</div>
              <span className="text-[10px] text-slate-600 font-medium block">
                MRPL SOP-4.2.1 — Page 18 <button onClick={() => openSourceViewer(1)} className="text-blue-600 font-bold hover:underline">[1]</button>
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-rose-200 shadow-2xs">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Non-Conformance Variance</span>
              <div className="text-base font-bold text-rose-900 mt-0.5">+6 Months (+50% Overrun)</div>
              <span className="text-[10px] text-rose-700 font-semibold block">
                Tube breach & leakage risk
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 6. GENERATED DELIVERABLE NOTE */}
      {currentTask && currentTask.deliverable && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          
          {/* Deliverable Header */}
          <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded border border-blue-200">
                    {currentTask.deliverable.referenceNumber}
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {currentTask.deliverable.status}
                  </span>
                </div>
                <h2 className="font-extrabold text-slate-900 text-sm mt-1">
                  {currentTask.deliverable.title}
                </h2>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => openSourceViewer(1)}
                className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Sources</span>
              </button>

              <button
                onClick={handleExportDOCX}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export DOCX</span>
              </button>

              <button
                onClick={() => {
                  handleSendForApproval();
                  navigateTo('approvals');
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send for Approval</span>
              </button>
            </div>
          </div>

          {/* Document Content */}
          <div className="p-6 lg:p-8 space-y-5 max-w-4xl mx-auto bg-white font-sans text-slate-900 leading-relaxed">
            
            {/* Letterhead */}
            <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-extrabold text-slate-900 text-xs tracking-tight block">
                  MANGALORE REFINERY AND PETROCHEMICALS LIMITED (MRPL)
                </span>
                <span className="text-slate-500 text-[11px] font-medium">Directorate of Refinery Operations • Asset Integrity Division</span>
              </div>
              <div className="text-right font-mono text-[10px] text-slate-600">
                <div>Date: {currentTask.deliverable.generatedDate}</div>
                <div>Ref: {currentTask.deliverable.referenceNumber}</div>
              </div>
            </div>

            {/* Section 1: Executive Summary */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
                1. Executive Summary & Compliance Verdict
              </h3>
              <p className="text-xs text-slate-800 leading-relaxed text-justify">
                {currentTask.deliverable.executiveSummary}
              </p>
            </div>

            {/* Section 2: Key Findings Matrix */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
                2. Inspection Findings & Non-Destructive Testing (NDT) Summary
              </h3>
              <div className="space-y-2 text-xs">
                {currentTask.deliverable.findings.map((f, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold flex-shrink-0 mt-0.5 ${
                      f.status === 'Non-Conformance' 
                        ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                        : f.status === 'Observation'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {f.status}
                    </span>
                    <div className="flex-1">
                      <span className="text-slate-800 leading-normal text-xs">{f.point}</span>
                      <button 
                        onClick={() => openSourceViewer(f.citationId)}
                        className="citation-badge ml-1"
                        title="Click to view authoritative source excerpt"
                      >
                        [{f.citationId}]
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: SOP Compliance Comparison Table */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
                3. SOP-4.2.1 Standard vs Observed Comparison
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[9px]">
                    <tr>
                      <th className="p-2.5">Criterion / Parameter</th>
                      <th className="p-2.5">Observed (Inspection)</th>
                      <th className="p-2.5">Mandatory SOP Limit</th>
                      <th className="p-2.5">Compliance</th>
                      <th className="p-2.5">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[10px]">
                    {currentTask.deliverable.sopComparison.map((row, idx) => (
                      <tr key={idx} className={row.compliance === 'DEVIATION' ? 'bg-rose-50/60' : 'bg-white'}>
                        <td className="p-2.5 font-sans font-semibold text-slate-900">{row.criterion}</td>
                        <td className="p-2.5 text-slate-800">{row.observed}</td>
                        <td className="p-2.5 text-slate-800">{row.standard}</td>
                        <td className="p-2.5 font-bold">
                          <span className={`px-2 py-0.5 rounded text-[9px] ${
                            row.compliance === 'DEVIATION' 
                              ? 'bg-rose-200 text-rose-900 border border-rose-300' 
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {row.compliance}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <button 
                            onClick={() => openSourceViewer(row.citationId)} 
                            className="citation-badge"
                          >
                            [{row.citationId}]
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4: AI Recommendation & Draft Action */}
            <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-1.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                4. Recommended Action & Engineering Directive
              </h4>
              <p className="text-xs text-blue-950 leading-relaxed">
                {currentTask.deliverable.recommendation}
              </p>
            </div>

            {/* Section 5: Sign-Off */}
            <div className="border-t border-slate-200 pt-3 flex flex-wrap items-end justify-between gap-4 text-xs text-slate-600">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Initiated By</span>
                <span className="font-bold text-slate-900 block mt-0.5">{currentUser.name}</span>
                <span className="text-[10px] text-slate-500">{currentUser.roleTitle}</span>
              </div>

              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Verification Hash</span>
                <span className="font-mono text-[9px] text-slate-500 block mt-0.5">
                  SHA-256: e8d7c6b5a49382710f9e8d7c6b5a...
                </span>
                <span className="text-[9px] text-emerald-700 font-bold">✓ Zero Outbound Data Leakage</span>
              </div>

              <div className="text-right">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Approving Authority</span>
                {currentTask.deliverable.approvedBy ? (
                  <div>
                    <span className="font-bold text-emerald-800 block mt-0.5">{currentTask.deliverable.approvedBy}</span>
                    <span className="text-[9px] font-mono text-emerald-700">{currentTask.deliverable.digitalSignature}</span>
                  </div>
                ) : (
                  <span className="italic text-amber-700 font-semibold block mt-0.5 text-[11px]">
                    Pending Review in Approval Queue
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Deliverable Footer */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              Model: {currentTask.deliverable.generatedByModel}
            </span>
            <button
              onClick={() => {
                handleSendForApproval();
                navigateTo('approvals');
              }}
              className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <span>Proceed to Approval Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
