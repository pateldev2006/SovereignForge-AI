import React, { useState, useRef, useEffect } from 'react';
import { useApp, SystemStatusMode } from '../../context/AppContext';
import { 
  Bot, Play, UploadCloud, CheckCircle2, AlertTriangle, 
  ArrowRight, ShieldCheck, Cpu, RefreshCw, ExternalLink, 
  Clock, Sparkles, Check, ChevronDown, ChevronUp, Download, Send, 
  Layers, Eye, FileCheck, FileText, FileSpreadsheet, Image as ImageIcon,
  Activity, Zap, Compass, Flame, CheckSquare, MessageSquare, User, Paperclip, 
  CornerDownLeft, X, Mic, MicOff, Camera, FolderOpen, Database, Sliders,
  ThumbsUp, ThumbsDown, Flag, Edit3, SplitSquareVertical, FileCode2,
  Presentation, Pause, Square, AlertCircle, HelpCircle, HardDrive,
  PanelRightClose, PanelRightOpen, ChevronLeft, ChevronRight
} from 'lucide-react';
import { downloadApprovalNotePDF } from '../../utils/exportUtils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  citations?: string[];
  isTyping?: boolean;
}

// Pre-seeded demo conversation
const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'sys-1',
    role: 'system',
    content: 'Secure session initialized in CDU-03 Complex. All reasoning executes locally on sovereign GPU infrastructure. Zero cloud egress.',
    timestamp: new Date(Date.now() - 1200000),
  },
  {
    id: 'usr-1',
    role: 'user',
    content: 'What is the remaining wall thickness of Heat Exchanger HX-204 shell side according to the latest inspection report?',
    timestamp: new Date(Date.now() - 1100000),
  },
  {
    id: 'ast-1',
    role: 'assistant',
    content: 'Based on the NDT Inspection Report (Doc ID: INSP/2026/HX-204-Q3, dated 15-Jun-2026), the measured wall thickness of HX-204 shell side is **8.2 mm** at the thinnest point (Location: Nozzle N2 vicinity, Grid Reference C4).\n\nThe original design thickness per ASME Section VIII Div.1 is **12.5 mm**, and the minimum retirement thickness per SOP-4.2.1 Rev 4 is **7.8 mm**.\n\n📊 **Corrosion rate:** 0.28 mm/year (calculated from 2019 baseline)\n📅 **Estimated remaining life:** ~1.4 years before retirement threshold\n\n⚠️ This is within the SOP-mandated "Enhanced Monitoring Zone" (< 2mm above retirement). SOP-4.2.1 §6.3 requires inspection frequency to be increased to quarterly.',
    timestamp: new Date(Date.now() - 1050000),
    citations: ['SOP-4.2.1 §6.3', 'INSP/2026/HX-204-Q3'],
  },
  {
    id: 'usr-2',
    role: 'user',
    content: 'Does this mean we need to schedule an early turnaround for HX-204?',
    timestamp: new Date(Date.now() - 900000),
  },
  {
    id: 'ast-2',
    role: 'assistant',
    content: 'Based on the current corrosion rate and SOP guidelines, here is the assessment:\n\n**Immediate turnaround is NOT required**, but early planning is recommended:\n\n1. **Current status:** Wall thickness (8.2mm) is above the retirement limit (7.8mm) with ~1.4 years margin\n2. **SOP-4.2.1 §7.1** states turnaround must be scheduled when remaining life falls below 12 months — you have ~2 months of buffer\n3. **Recommendation:** Schedule turnaround for Q1 2027 (6 months ahead of the normal 5-year cycle)\n\n**Required actions per SOP:**\n- ✅ Increase inspection to quarterly (next due: Sep 2026)\n- ✅ Issue Engineering Change Notice (ECN) for revised turnaround schedule\n- ✅ Notify Approving Authority for budget pre-approval\n\nWould you like me to draft the Turnaround Advance Planning Note for management approval?',
    timestamp: new Date(Date.now() - 850000),
    citations: ['SOP-4.2.1 §7.1', 'SOP-4.2.1 §6.3', 'Industrial Turnaround Policy Rev 3'],
  },
];

// Response bank for questions
const AI_RESPONSE_BANK: { keywords: string[]; response: string; citations: string[] }[] = [
  {
    keywords: ['turnaround', 'plan', 'draft', 'planning note'],
    response: 'I\'ve drafted the Turnaround Advance Planning Note (Ref: MECH/2026/TA-HX204-ADV).\n\n**Key contents:**\n- Equipment: HX-204 Shell & Tube Heat Exchanger\n- Proposed date: Q1 2027 (Jan-Mar window)\n- Estimated duration: 14 days\n- Budget estimate: ₹2.8 Cr (tube bundle replacement + shell weld overlay)\n- Critical path: Tube bundle procurement (12-week lead time)\n\nThe note has been formatted per Technical Services Directorate template and is ready for your review before submission to the Approving Authority queue.\n\nWould you like me to send it to Dr. Vikram Shetty\'s approval queue?',
    citations: ['Industrial Turnaround Policy Rev 3', 'PROC/Budget-2026'],
  },
  {
    keywords: ['sop', 'standard', 'procedure', 'compliance'],
    response: 'Here are the relevant SOPs for your current context:\n\n1. **SOP-4.2.1** (Static Equipment Inspection & Maintenance) — Rev 4, 120 pages\n   - §6.3: Enhanced monitoring criteria\n   - §7.1: Turnaround scheduling thresholds\n   - §8.2: NDT methodology requirements\n\n2. **SOP-3.1.7** (Corrosion Management Program) — Rev 6\n   - §4.1: Corrosion rate calculation methodology\n   - §5.2: Risk-based inspection intervals\n\n3. **OISD-STD-129** (Inspection of Static Equipment)\n   - Clause 7: Minimum thickness criteria\n\nAll SOPs are indexed in the local vector store. Click any reference to view the exact source passage.',
    citations: ['SOP-4.2.1 Rev 4', 'SOP-3.1.7 Rev 6', 'OISD-STD-129'],
  },
  {
    keywords: ['corrosion', 'rate', 'thickness', 'measurement'],
    response: 'The corrosion rate analysis for HX-204 based on historical NDT data:\n\n📊 **Corrosion Rate Trend:**\n| Year | Thickness (mm) | Rate (mm/yr) |\n|------|---------------|-------------|\n| 2019 | 10.3 | — (baseline) |\n| 2021 | 9.7 | 0.30 |\n| 2023 | 9.1 | 0.30 |\n| 2025 | 8.5 | 0.30 |\n| 2026 | 8.2 | 0.28 |\n\nThe rate has slightly decreased (0.28 mm/yr vs historical 0.30 mm/yr), possibly due to the inhibitor dosing change in 2024. However, SOP-4.2.1 §6.1 mandates using the **worst-case historical rate** (0.30 mm/yr) for remaining life calculations.\n\n**At 0.30 mm/yr:** Retirement threshold (7.8mm) reached in ~1.33 years (Feb 2028)\n**At 0.28 mm/yr:** Retirement threshold reached in ~1.43 years (Mar 2028)',
    citations: ['NDT Historical Database', 'SOP-4.2.1 §6.1'],
  },
  {
    keywords: ['approve', 'approval', 'send', 'submit', 'queue'],
    response: 'I\'ve prepared the submission package for the Approving Authority queue:\n\n📋 **Approval Package Contents:**\n1. Technical Approval Note (MECH/2026/HX-204-APPR)\n2. NDT Inspection Report Summary\n3. SOP Deviation Analysis (6-month overhaul variance)\n4. Cost estimate and turnaround schedule\n5. Risk assessment matrix\n\n**Routing:** → Dr. Vikram Shetty (VP Technical) → Budget Committee\n**Priority:** HIGH (equipment integrity concern)\n**Digital signature:** Required (RSA-2048 + employee smart card)\n\nThe package is ready in the Approval Queue. The Approving Authority will receive a notification on their dashboard.\n\n✅ All provenance chains are intact — every claim traces back to source documents.',
    citations: ['MECH/2026/HX-204-APPR', 'Approval Workflow SOP-9.1'],
  },
];

const DEFAULT_AI_RESPONSE = {
  response: 'I\'ve processed your query against the local document store and SOP knowledge base. Based on the indexed materials for CDU/VDU Unit 03 and Heat Exchanger HX-204:\n\nThe information you\'re looking for requires cross-referencing multiple source documents. I\'ve identified 3 relevant passages from the ingested inspection reports and 2 SOP sections that address this topic.\n\nWould you like me to:\n1. Show the detailed source excerpts with provenance links?\n2. Generate a formal summary note for the record?\n3. Flag any SOP deviations related to your query?',
  citations: ['Local Vector Store', 'SOP Knowledge Base'],
};

// Task Templates definition per Spec
const TASK_TEMPLATES = [
  {
    id: 'tpl-1',
    title: 'Approval Note',
    icon: FileCheck,
    desc: 'SOP audit & NDT report comparison for sign-off',
    prompt: 'Prepare approval note for Heat Exchanger HX-204 and check against relevant SOPs.',
    files: ['inspection_report.pdf', 'SOP_4.2.1.pdf', 'P&ID_Unit_03.png', 'inspection_photo.jpg']
  },
  {
    id: 'tpl-2',
    title: 'Deviation Report',
    icon: AlertTriangle,
    desc: 'Flag non-conformance against OISD / ASME / SOPs',
    prompt: 'Audit P&ID Unit 03 relief valve PSV-304 setpoint and overhaul timeline against OISD-STD-129 and SOP-4.2.1.',
    files: ['P&ID_Unit_03.png', 'SOP_4.2.1.pdf']
  },
  {
    id: 'tpl-3',
    title: 'Vendor Bid Comparison',
    icon: FileSpreadsheet,
    desc: 'Line-by-line commercial scope & warranty evaluation',
    prompt: 'Compare L&T Turnaround Vendor Bid line items against Standard Engineering Scope Matrix and warranty terms.',
    files: ['vendor_bid.xlsx', 'SOP_4.2.1.pdf']
  },
  {
    id: 'tpl-4',
    title: 'Shift Handover Note',
    icon: Clock,
    desc: 'Compile unit logs, active alarms, and pending NDTs',
    prompt: 'Compile shift handover report for CDU-03 capturing crude charge rate, furnace bridge temperature, and pending HX-204 inspection.',
    files: ['inspection_report.pdf', 'P&ID_Unit_03.png']
  },
  {
    id: 'tpl-5',
    title: 'Calculation Sheet',
    icon: Cpu,
    desc: 'Auditable mathematical breakdown with formulas',
    prompt: 'Calculate corrosion rate and remaining life for HX-204 shell side using historical NDT logs and ASME Section VIII formula.',
    files: ['inspection_report.pdf']
  },
  {
    id: 'tpl-6',
    title: 'Board Summary Deck',
    icon: FileText,
    desc: 'High-level management summary & CAPEX review',
    prompt: 'Draft executive management board deck on CDU-03 turnaround CAPEX and static equipment integrity status.',
    files: ['inspection_report.pdf', 'SOP_4.2.1.pdf', 'vendor_bid.xlsx']
  },
];

export const AIWorkbench: React.FC = () => {
  const { 
    currentUser, 
    currentTask, 
    runAgentTask, 
    isAgentRunning, 
    agentProgressStep, 
    openSourceViewer, 
    resetTaskToFresh, 
    systemMode, 
    setSystemMode, 
    showToast 
  } = useApp();

  // ═══ STATE MANAGEMENT ═══
  const [activeWorkspace, setActiveWorkspace] = useState('CDU-03 Complex');
  const [promptInput, setPromptInput] = useState<string>(
    'Prepare approval note for Heat Exchanger HX-204 and check against relevant SOPs.'
  );
  const [selectedFiles, setSelectedFiles] = useState<string[]>([
    'inspection_report.pdf',
    'SOP_4.2.1.pdf',
    'P&ID_Unit_03.png',
    'inspection_photo.jpg'
  ]);
  const [selectedModel, setSelectedModel] = useState('qwen-deepseek-hybrid');

  // Multi-modal Live input states
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isDmsPickerOpen, setIsDmsPickerOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Agent execution flow states
  const [isAgentPaused, setIsAgentPaused] = useState(false);
  const [agentStepModel, setAgentStepModel] = useState<Record<number, string>>({
    1: 'Intent-Classifier-v2 (Local)',
    2: 'Qwen2.5-VL-7B (Vision OCR)',
    3: 'BGE-M3 (Dense Embedding)',
    4: 'BM25 + Cross-Encoder (Sparse)',
    5: 'DeepSeek-R1-Distill-70B',
    6: 'Deterministic Rule Engine',
    7: 'Cryptographic Signature Engine'
  });

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatTyping, setIsChatTyping] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInitialMount = useRef(true);

  // Agent Pipeline Expansion State (Shot 4 Demo Trace)
  const [isAgentTraceExpanded, setIsAgentTraceExpanded] = useState<boolean>(true);

  // Right Column View States
  const [isDeliverableStudioOpen, setIsDeliverableStudioOpen] = useState<boolean>(true);
  const [deliverableFormatTab, setDeliverableFormatTab] = useState<'docx' | 'xlsx' | 'pptx' | 'pdf' | 'code' | 'diff'>('docx');
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [editableDraft, setEditableDraft] = useState<string>(
    `# TECHNICAL APPROVAL NOTE — MECH/2026/HX-204-APPR\n\n**EQUIPMENT:** Heat Exchanger HX-204 (Crude Distillation Unit 03)\n**CURRENT WALL THICKNESS:** 8.2 mm (Min. allowable: 7.8 mm)\n**CORROSION RATE:** 0.28 mm/year\n**RECOMMENDED ACTION:** Advance Turnaround window to Q1 2027 per SOP-4.2.1 §7.1.\n\n**DEVIATION DETECTED:** Field inspector proposal (18 months) exceeds SOP statutory limit (12 months). Requesting executive override.`
  );
  const [trainingSignalOptIn, setTrainingSignalOptIn] = useState(true);

  // Past Sessions Search
  const [sessionSearch, setSessionSearch] = useState('');
  const [pastSessions] = useState([
    { id: 'sess-1', title: 'HX-204 NDT Inspection & SOP Audit', date: 'Today, 11:20 AM', tag: 'HX-204', status: 'Completed' },
    { id: 'sess-2', title: 'PSV-304 Relief Valve Sizing Check', date: 'Yesterday', tag: 'PSV-304', status: 'Approved' },
    { id: 'sess-3', title: 'CDU-03 Furnace Bridge Temp Analysis', date: '24 Sep 2026', tag: 'F-101', status: 'Archived' },
    { id: 'sess-4', title: 'L&T Turnaround Commercial Bid Review', date: '21 Sep 2026', tag: 'Turnaround-27', status: 'Completed' },
  ]);

  // Handle native file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFileNames: string[] = [];
    for (let i = 0; i < files.length; i++) {
      newFileNames.push(files[i].name);
    }

    setSelectedFiles(prev => Array.from(new Set([...prev, ...newFileNames])));
    showToast(
      'Document Attached & Indexed',
      `Attached ${newFileNames.length} file(s). Local OCR & vector embeddings generated on sovereign GPU node.`,
      'success'
    );
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Drag and drop handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedNames: string[] = [];
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        droppedNames.push(e.dataTransfer.files[i].name);
      }
      setSelectedFiles(prev => Array.from(new Set([...prev, ...droppedNames])));
      showToast('Files Dropped & Ingested', `Attached ${droppedNames.length} file(s) to active agent context.`, 'success');
    }
  };

  const handleRemoveAttachedFile = (fileName: string) => {
    setSelectedFiles(prev => prev.filter(f => f !== fileName));
    showToast('File Detached', `Removed ${fileName} from AI active context.`, 'info');
  };

  // Voice dictation simulation
  const toggleVoiceDictation = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      const transcribed = ' Audit the measured wall thickness for Heat Exchanger HX-204 and check against SOP-4.2.1 turnaround intervals.';
      setPromptInput(prev => prev + transcribed);
      showToast('Voice Transcribed', 'Processed audio locally with Whisper-OnPrem (zero cloud egress).', 'success');
    } else {
      setIsRecordingVoice(true);
      showToast('Voice Recording Active', 'Speak your engineering directive into the microphone...', 'info');
    }
  };

  // Camera capture simulation
  const handleCapturePhoto = () => {
    const photoName = `field_capture_${Date.now().toString().slice(-4)}.jpg`;
    setSelectedFiles(prev => [...prev, photoName]);
    setIsCameraActive(false);
    showToast('Photo Captured & Ingested', `Attached ${photoName} from field camera inspection.`, 'success');
  };

  // Auto-scroll chat only within box
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isChatTyping]);

  // Send chat message
  const handleSendChat = () => {
    const trimmed = chatInput.trim();
    if (!trimmed || isChatTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatTyping(true);

    const delay = 1400 + Math.random() * 1200;
    setTimeout(() => {
      const lowerInput = trimmed.toLowerCase();
      const matched = AI_RESPONSE_BANK.find(r =>
        r.keywords.some(kw => lowerInput.includes(kw.toLowerCase()))
      );
      const responseData = matched || DEFAULT_AI_RESPONSE;

      const aiMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: responseData.response,
        timestamp: new Date(),
        citations: responseData.citations,
      };
      setChatMessages(prev => [...prev, aiMsg]);
      setIsChatTyping(false);
    }, delay);
  };

  // Select Template handler
  const handleSelectTemplate = (tpl: typeof TASK_TEMPLATES[0]) => {
    setPromptInput(tpl.prompt);
    setSelectedFiles(tpl.files);
    showToast('Template Applied', `Loaded template "${tpl.title}" with pre-indexed document context.`, 'info');
  };

  // Run full Agent pipeline
  const handleRunPipeline = () => {
    if (selectedFiles.length === 0) {
      showToast('No Documents Attached', 'Please attach at least one document for the agent to analyze.', 'warning');
      return;
    }
    runAgentTask(promptInput, selectedFiles);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col bg-slate-100 font-sans">
      
      {/* ═══ 3-COLUMN WORKBENCH GRID ═══ */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-0 overflow-hidden">
        
        {/* ────────────────────────────────────────────────────────────────
            COLUMN 1: LEFT PANEL — Workspaces, Templates & Past Sessions (3 Cols)
           ──────────────────────────────────────────────────────────────── */}
        <div className="xl:col-span-3 bg-white border-r border-slate-200/90 flex flex-col justify-between overflow-y-auto max-h-[calc(100vh-105px)] p-4 space-y-5">
          
          {/* 1. Workspace Selector */}
          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Active Industrial Workspace
            </label>
            <div className="relative">
              <select
                value={activeWorkspace}
                onChange={(e) => {
                  setActiveWorkspace(e.target.value);
                  showToast('Workspace Switched', `Active context shifted to ${e.target.value}.`, 'info');
                }}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                <option value="CDU-03 Complex">🏭 CDU-03 Complex (Crude Distillation)</option>
                <option value="VDU-02 Fractionation">⚙️ VDU-02 Fractionation Unit</option>
                <option value="FCCU Unit 01">🔥 FCCU Fluidized Catalytic Cracker</option>
                <option value="Offsites & Utilities">💧 Offsites, Steam & Water Treatment</option>
              </select>
            </div>
          </div>

          {/* 2. Industrial Task Templates */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3 h-3 text-blue-600" />
                Industrial Templates
              </label>
              <span className="text-[9px] font-mono text-blue-600 font-bold">1-Click Starter</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {TASK_TEMPLATES.map((tpl) => {
                const IconComponent = tpl.icon;
                const isSelected = promptInput === tpl.prompt;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-400/30' 
                        : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 truncate">{tpl.title}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{tpl.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Recent Sessions & History */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-400" />
                Recent Sessions
              </label>
              <span className="text-[9px] font-mono text-slate-400">{pastSessions.length} saved</span>
            </div>

            <input
              type="text"
              placeholder="Search past tasks by tag or equipment..."
              value={sessionSearch}
              onChange={(e) => setSessionSearch(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[11px] text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none mb-2"
            />

            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
              {pastSessions
                .filter(s => s.title.toLowerCase().includes(sessionSearch.toLowerCase()) || s.tag.toLowerCase().includes(sessionSearch.toLowerCase()))
                .map((s) => (
                  <div 
                    key={s.id}
                    onClick={() => showToast('Session Loaded', `Resumed task session "${s.title}".`, 'info')}
                    className="p-2 rounded-lg border border-slate-200/60 bg-slate-50/50 hover:bg-slate-100/80 cursor-pointer transition-colors text-xs flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <h5 className="font-bold text-[11px] text-slate-800 truncate">{s.title}</h5>
                      <span className="text-[9px] text-slate-400 font-mono">{s.date} • tag: {s.tag}</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex-shrink-0">
                      {s.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* 4. Mounted SAP / DMS Storage Quick Shelf */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-600 uppercase">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                Mounted DMS / SAP Storage
              </span>
              <span className="text-emerald-700">● MOUNTED</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Direct access to read-only engineering share <code className="font-mono text-[9px] bg-white px-1 py-0.5 rounded border">/shares/dms/cdu03/</code> with zero re-upload.
            </p>
            <button
              onClick={() => setIsDmsPickerOpen(true)}
              className="w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FolderOpen className="w-3 h-3 text-slate-500" />
              <span>Browse Mounted DMS Files</span>
            </button>
          </div>

          {/* 5. Demo Asset Helper (Download Sample PDF for Shot 2) */}
          <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-[10px] font-bold text-blue-900">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Demo Asset (Shot 2)</span>
              </span>
              <span className="text-[9px] font-mono text-blue-700 bg-white px-1.5 py-0.2 rounded border border-blue-100">PDF Ready</span>
            </div>
            <p className="text-[10px] text-slate-600 leading-tight">
              Download the official sample NDT report to your computer to upload in Shot 2.
            </p>
            <a
              href="/sample_inspection_report.pdf"
              download="sample_inspection_report.pdf"
              className="w-full py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer no-underline"
            >
              <Download className="w-3 h-3" />
              <span>Download Sample Report (.pdf)</span>
            </a>
          </div>

        </div>

        {/* ────────────────────────────────────────────────────────────────
            COLUMN 2: CENTER PANEL — Composer, Conversational Chat & Live Agent Trace
           ──────────────────────────────────────────────────────────────── */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`${isDeliverableStudioOpen ? 'xl:col-span-5' : 'xl:col-span-9'} bg-white border-r border-slate-200/90 flex flex-col justify-between overflow-y-auto max-h-[calc(100vh-105px)] relative transition-all duration-200 ${
            isDragOver ? 'ring-4 ring-blue-500/30 bg-blue-50/20' : ''
          }`}
        >
          
          {/* Drag Overlay Notification */}
          {isDragOver && (
            <div className="absolute inset-0 z-40 bg-blue-600/10 backdrop-blur-xs flex items-center justify-center border-2 border-dashed border-blue-600 pointer-events-none">
              <div className="bg-white p-4 rounded-2xl shadow-xl border border-blue-200 flex items-center gap-3">
                <UploadCloud className="w-8 h-8 text-blue-600 animate-bounce" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Drop files into Sovereign Context</h4>
                  <p className="text-xs text-slate-500">PDF, PNG, JPG, XLSX, DWG, MSG, JSON accepted</p>
                </div>
              </div>
            </div>
          )}

          {/* Top Chat & Agent Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-black text-slate-900 text-sm tracking-tight">Conversational AI Engine</h2>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-green"></span>
                    AIR-GAPPED
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Multi-turn industrial reasoning with deterministic citations & OCR confidence tracking
                </p>
              </div>
            </div>

            {/* Action Buttons: Clear Chat & Studio Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setChatMessages([INITIAL_CHAT_MESSAGES[0]]);
                  showToast('Chat Cleared', 'Conversation history reset. Audit provenance retained.', 'info');
                }}
                className="text-[10px] font-bold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                Clear
              </button>

              <button
                onClick={() => setIsDeliverableStudioOpen(!isDeliverableStudioOpen)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                  isDeliverableStudioOpen 
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm'
                }`}
                title={isDeliverableStudioOpen ? 'Retract Live Deliverable Studio' : 'Open Live Deliverable Studio'}
              >
                {isDeliverableStudioOpen ? (
                  <>
                    <PanelRightClose className="w-3.5 h-3.5 text-slate-500" />
                    <span>Retract Studio ❯</span>
                  </>
                ) : (
                  <>
                    <PanelRightOpen className="w-3.5 h-3.5 text-white" />
                    <span>❮ Open Studio (Draft Ready)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Conversational Chat Messages Area */}
          <div ref={chatContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto bg-[#FAFBFC]">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role !== 'user' && (
                  <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-white ${
                    msg.role === 'system' ? 'bg-slate-600' : 'bg-blue-600'
                  }`}>
                    {msg.role === 'system' ? <ShieldCheck className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md shadow-xs'
                    : msg.role === 'system'
                    ? 'bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-mono italic'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-bl-md'
                }`}>
                  {msg.content.split('\n').map((line, i) => {
                    const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    return (
                      <p 
                        key={i} 
                        className={`${i > 0 ? 'mt-1.5' : ''} ${line === '' ? 'mt-2' : ''}`}
                        dangerouslySetInnerHTML={{ __html: formatted }}
                      />
                    );
                  })}

                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] font-mono font-bold text-slate-400">PROVENANCE:</span>
                      {msg.citations.map((cite, i) => (
                        <button
                          key={i}
                          onClick={() => openSourceViewer(i)}
                          className="citation-badge"
                        >
                          [{i + 1}] {cite}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className={`mt-1.5 text-[9px] font-mono flex items-center justify-between ${
                    msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}>
                    <span>{msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.role === 'assistant' && <span>✓ Local GPU Verified</span>}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg flex-shrink-0 bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
                    {currentUser.avatar || 'U'}
                  </div>
                )}
              </div>
            ))}

            {isChatTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg flex-shrink-0 bg-blue-600 text-white flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200 shadow-xs rounded-2xl rounded-bl-md px-4 py-2.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  <span className="text-[10px] text-slate-500 ml-1 font-mono">Running local vector retrieval...</span>
                </div>
              </div>
            )}
          </div>

          {/* ═══ MULTI-STEP AGENT TRACE (EXPANDABLE PER SHOT 4) ═══ */}
          <div className="border-t border-slate-200 bg-slate-50 p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Agent Execution Pipeline</span>
                <button
                  onClick={() => setIsAgentTraceExpanded(!isAgentTraceExpanded)}
                  className="text-[9px] font-mono font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Click to toggle full agent execution trace"
                >
                  <span>{agentProgressStep}/7 Steps</span>
                  {isAgentTraceExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Dynamic Model Router Badge (Shot 4 Hover Target) */}
              <div 
                className="group relative hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs cursor-help"
                title="Model Router dynamically assigns specialized local neural weights per step"
              >
                <span className="text-[9px] font-bold uppercase text-slate-400">ROUTER:</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border flex items-center gap-1 ${
                  agentProgressStep <= 2
                    ? 'bg-purple-50 text-purple-800 border-purple-200'
                    : agentProgressStep <= 5
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {agentProgressStep <= 2 
                    ? '👁️ Vision (Qwen2.5-VL-72B)' 
                    : agentProgressStep <= 5 
                    ? '🧠 Reasoning (DeepSeek-R1)' 
                    : '✍️ Drafting (Qwen-2.5-72B)'}
                </span>

                {/* Model Router Hover Tooltip Card */}
                <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-64 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl text-[10px] font-mono z-30 border border-slate-700 pointer-events-none">
                  <div className="font-bold text-emerald-400 flex items-center justify-between pb-1 border-b border-slate-800">
                    <span>ACTIVE AIR-GAPPED WEIGHTS</span>
                    <span>0 EGRESS</span>
                  </div>
                  <div className="pt-1.5 space-y-1 text-slate-300">
                    <div>• <strong>Current:</strong> {agentProgressStep <= 2 ? 'Qwen2.5-VL-72B (Vision)' : agentProgressStep <= 5 ? 'DeepSeek-R1-Distill-70B' : 'Qwen-2.5-72B-Instruct'}</div>
                    <div>• <strong>Latency:</strong> ~340ms • <strong>VRAM:</strong> 42.4 GB</div>
                    <div>• <strong>Integrity:</strong> SHA-256 Bit-Level Verified</div>
                  </div>
                </div>
              </div>

              {/* Agent Pause / Stop Controls */}
              <div className="flex items-center gap-1.5">
                {isAgentRunning && (
                  <>
                    <button
                      onClick={() => {
                        setIsAgentPaused(!isAgentPaused);
                        showToast(isAgentPaused ? 'Agent Resumed' : 'Agent Paused', 'Paused pipeline execution.', 'info');
                      }}
                      className="p-1 rounded bg-amber-100 text-amber-800 hover:bg-amber-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Pause className="w-3 h-3" />
                      <span>{isAgentPaused ? 'Resume' : 'Pause'}</span>
                    </button>
                    <button
                      onClick={() => {
                        resetTaskToFresh();
                        showToast('Agent Stopped', 'Pipeline execution halted by user.', 'warning');
                      }}
                      className="p-1 rounded bg-rose-100 text-rose-800 hover:bg-rose-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Square className="w-3 h-3" />
                      <span>Stop</span>
                    </button>
                  </>
                )}
                <button
                  onClick={handleRunPipeline}
                  disabled={isAgentRunning}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {isAgentRunning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-white" />}
                  <span>{isAgentRunning ? 'Running...' : 'Run Agent'}</span>
                </button>
              </div>
            </div>

            {/* Step List Mini Progress Bar */}
            <div className="grid grid-cols-7 gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <div
                  key={s}
                  title={`Step ${s}: ${
                    s === 1 ? 'OCR & Table Parsing' :
                    s === 2 ? 'P&ID Vision Analysis' :
                    s === 3 ? 'SOP RAG Retrieval' :
                    s === 4 ? 'API 510 Math Verification' :
                    s === 5 ? 'SOP Deviation Audit' :
                    s === 6 ? 'Approval Note Synthesis' :
                    'SHA-256 Ledger Attestation'
                  }`}
                  className={`h-1.5 rounded-full transition-all ${
                    s <= agentProgressStep ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>

            {/* Detailed Expanded Steps (Shot 4 Viewer Reading Trace) */}
            {isAgentTraceExpanded && (
              <div className="pt-2 border-t border-slate-200/80 space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                {[
                  { step: 1, title: 'Document OCR & Layout Table Parsing', model: 'PaddleOCR + Tesseract Engine', time: '140ms', detail: 'Extracted NDT ultrasonic table, shell thickness grid C4' },
                  { step: 2, title: 'P&ID Engineering Drawing Computer Vision', model: 'Qwen-2.5-VL-72B-Vision (Local)', time: '380ms', detail: 'Identified Heat Exchanger HX-204 shell nozzle N2 tag' },
                  { step: 3, title: 'Dense SOP RAG Retrieval & Vector Search', model: 'BAAI BGE-M3 (1024-dim dense)', time: '18ms', detail: 'Retrieved SOP-4.2.1 §7.1 and OISD-STD-129 overhaul clauses' },
                  { step: 4, title: 'API 510 Mathematical Formula Verification', model: 'Python SymPy Sandbox (Isolated)', time: '24ms', detail: 'Corrosion rate 0.28 mm/yr, remaining life 1.43 years' },
                  { step: 5, title: 'SOP Non-Conformance & Deviation Audit', model: 'DeepSeek-R1-Distill-70B (Local)', time: '410ms', detail: 'Flagged 18-month proposal against SOP 12-month sour crude statutory limit' },
                  { step: 6, title: 'Formal Technical Approval Note Synthesis', model: 'Qwen-2.5-72B-Instruct (Local)', time: '620ms', detail: 'Drafted 3-point executive note with strict source provenance' },
                  { step: 7, title: 'Cryptographic SHA-256 Ledger Attestation', model: 'Hardware HSM Root of Trust', time: '8ms', detail: 'Zero cloud egress invariant verified & tamper-evident signature generated' },
                ].map((st) => (
                  <div 
                    key={st.step}
                    className={`p-2 rounded-lg border text-[11px] transition-all flex items-start justify-between gap-2 ${
                      st.step < agentProgressStep
                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                        : st.step === agentProgressStep
                        ? 'bg-blue-50 border-blue-300 text-blue-950 font-bold ring-1 ring-blue-300'
                        : 'bg-white/60 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono ${
                          st.step <= agentProgressStep ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {st.step}
                        </span>
                        <span>{st.title}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-sans pl-5">{st.detail}</p>
                    </div>

                    <div className="text-right font-mono text-[9px] flex-shrink-0">
                      <span className="text-blue-700 font-bold block">{st.model.split(' ')[0]}</span>
                      <span className="text-slate-400">{st.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ═══ COMPOSER & MULTI-MODAL IMPORT DOCK ═══ */}
          <div className="p-3.5 bg-white border-t border-slate-200 space-y-2.5">
            
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv,.py,.txt,.svg,.dwg,.doc,.docx,.msg,.eml,.json,.parquet"
              className="hidden"
            />

            {/* Attached Files Chips Bar with OCR Confidence Badges */}
            {selectedFiles.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 flex-shrink-0 flex items-center gap-1">
                  <Paperclip className="w-3 h-3 text-blue-600" />
                  Attached ({selectedFiles.length}):
                </span>
                {selectedFiles.map((fileName) => {
                  const isPdf = fileName.endsWith('.pdf');
                  const isImg = fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg');
                  const isSheet = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv');
                  
                  return (
                    <div 
                      key={fileName}
                      className="flex-shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-blue-50/90 border border-blue-200 text-[10px] font-bold text-blue-950 shadow-2xs"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isPdf ? 'bg-rose-500' : isImg ? 'bg-purple-500' : isSheet ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
                      <span className="truncate max-w-[130px] font-mono">{fileName}</span>
                      <span className="text-[8px] font-mono text-emerald-700 bg-emerald-100/60 px-1 py-0.2 rounded">
                        OCR 98.4%
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachedFile(fileName)}
                        className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors cursor-pointer"
                        title={`Remove ${fileName}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Textarea + Live Multi-modal Controls */}
            <div className="flex items-end gap-2">
              
              {/* Attachment Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
                title="Attach local files (PDF, DOCX, XLSX, PNG, DWG, ZIP, MSG)"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Voice Dictation Button */}
              <button
                type="button"
                onClick={toggleVoiceDictation}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                  isRecordingVoice 
                    ? 'bg-rose-500 border-rose-600 text-white animate-pulse' 
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
                title={isRecordingVoice ? 'Stop recording voice directive' : 'Dictate instruction via local microphone'}
              >
                {isRecordingVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Camera Photo Capture Button (Tablet / Field) */}
              <button
                type="button"
                onClick={() => {
                  setIsCameraActive(true);
                  handleCapturePhoto();
                }}
                className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
                title="Capture live field inspection photo (Tablet/Mobile)"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Prompt Textarea */}
              <div className="flex-1 relative">
                <textarea
                  ref={chatInputRef}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendChat();
                    }
                  }}
                  placeholder="Ask a question or type multi-step task directive (e.g., 'Compare wall thickness of HX-204 with SOP-4.2.1')..."
                  rows={2}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/60 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium resize-none leading-relaxed"
                />
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendChat}
                disabled={!chatInput.trim() || isChatTyping}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                  chatInput.trim() && !isChatTyping
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>

            </div>

            {/* Quick Starter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex-shrink-0">Quick:</span>
              {[
                'Draft an approval note for the corrosion findings. Check against our SOPs.',
                'What SOPs apply to HX-204?',
                'Show corrosion rate trend',
                'Draft turnaround plan',
                'Audit P&ID PSV-304'
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setChatInput(q);
                    setTimeout(() => chatInputRef.current?.focus(), 50);
                  }}
                  className="flex-shrink-0 px-2 py-0.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-[10px] font-semibold text-slate-700 hover:text-blue-700 whitespace-nowrap cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* ────────────────────────────────────────────────────────────────
            COLUMN 3: RIGHT PANEL — Deliverable Studio, Provenance & Export (Retractable)
           ──────────────────────────────────────────────────────────────── */}
        {isDeliverableStudioOpen && (
          <div className="xl:col-span-4 bg-white flex flex-col justify-between overflow-y-auto max-h-[calc(100vh-105px)] p-4 space-y-4 animate-in slide-in-from-right duration-150">
            
            {/* Header with Format Selector Tabs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  Live Deliverable Studio
                </h3>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsInlineEditing(!isInlineEditing)}
                    className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                      isInlineEditing ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Toggle Inline Direct Editor"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isInlineEditing ? 'Editing Mode' : 'Edit Draft'}</span>
                  </button>

                  <button
                    onClick={() => setIsDeliverableStudioOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    title="Retract Studio Panel"
                  >
                    <PanelRightClose className="w-4 h-4" />
                  </button>
                </div>
              </div>

            {/* Output Format Tabs per Spec */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {[
                { id: 'docx', label: 'Word (.docx)', icon: FileText },
                { id: 'xlsx', label: 'Excel (.xlsx)', icon: FileSpreadsheet },
                { id: 'pptx', label: 'Deck (.pptx)', icon: FileText },
                { id: 'pdf', label: 'PDF (.pdf)', icon: FileCheck },
                { id: 'code', label: 'Code (.py)', icon: FileCode2 },
                { id: 'diff', label: 'v1/v2 Diff', icon: SplitSquareVertical },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setDeliverableFormatTab(fmt.id as any)}
                  className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-bold transition-all text-center truncate ${
                    deliverableFormatTab === fmt.id
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {fmt.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Deliverable Body Viewer / Inline Editor */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 space-y-3 flex-1 min-h-[260px] overflow-y-auto">
            
            {/* ⚠️ Prominent SOP Deviation Detected Card (Shot 5 Hover & Click Target) */}
            <div 
              onClick={() => openSourceViewer(0)}
              className="p-3 bg-rose-50 border-2 border-rose-300 hover:border-rose-400 hover:bg-rose-100/90 rounded-xl space-y-1.5 cursor-pointer transition-all shadow-xs group"
              title="Click to view SOP-4.2.1 §7.1 statutory clause and source grounding"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[11px] text-rose-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse flex-shrink-0" />
                  <span>SOP Deviation Detected</span>
                </span>
                <span className="text-[9px] font-mono font-bold bg-rose-200/80 text-rose-900 px-1.5 py-0.5 rounded border border-rose-300 group-hover:bg-rose-300">
                  +6M OVERHAUL VARIANCE
                </span>
              </div>
              <p className="text-[11px] text-rose-900 leading-snug">
                Proposed field 18-month turnaround violates the 12-month limit mandated by <strong className="underline decoration-rose-500 font-bold">SOP-4.2.1 §7.1</strong> for sour crude service.
              </p>
              <div className="text-[10px] font-bold text-rose-700 flex items-center gap-1 group-hover:underline pt-0.5 font-mono">
                <span>[Click to inspect highlighted SOP-4.2.1 §7.1 clause]</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Contextual Badges */}
            <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-mono">
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                ✓ 3 CITATIONS VERIFIED
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                0 UNVERIFIED CLAIMS
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 font-bold">
                100% LOCAL DETERMINISTIC
              </span>
            </div>

            {/* View Mode: Text Draft / Live Preview */}
            {isInlineEditing ? (
              <textarea
                value={editableDraft}
                onChange={(e) => setEditableDraft(e.target.value)}
                rows={10}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-xs font-mono text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            ) : deliverableFormatTab === 'diff' ? (
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2 bg-rose-50 border border-rose-200 rounded text-rose-900 text-[11px]">
                  <span className="font-bold block text-rose-700">- v1 Draft:</span>
                  "Next turnaround scheduled for normal 5-year overhaul window in Q3 2027."
                </div>
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 text-[11px]">
                  <span className="font-bold block text-emerald-700">+ v2 Verified (SOP Compliance):</span>
                  "Advance turnaround to Q1 2027 (12-month interval mandated by SOP-4.2.1 for sour crude service)."
                </div>
              </div>
            ) : deliverableFormatTab === 'xlsx' ? (
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-800">Auditable Math & Remaining Life Table:</h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold text-[10px]">
                      <tr>
                        <th className="p-1.5">Parameter</th>
                        <th className="p-1.5">Value</th>
                        <th className="p-1.5">Formula / Ref</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[10px]">
                      <tr>
                        <td className="p-1.5 font-bold">Nominal Thickness</td>
                        <td className="p-1.5">12.5 mm</td>
                        <td className="p-1.5">ASME Sec VIII</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 font-bold">Measured Thickness</td>
                        <td className="p-1.5 text-blue-700 font-bold">8.2 mm</td>
                        <td className="p-1.5">NDT Grid C4</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 font-bold">Min. Retirement</td>
                        <td className="p-1.5 text-rose-700 font-bold">7.8 mm</td>
                        <td className="p-1.5">SOP-4.2.1 §6.1</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 font-bold">Corrosion Rate</td>
                        <td className="p-1.5">0.28 mm/yr</td>
                        <td className="p-1.5">(t_init - t_act) / yr</td>
                      </tr>
                      <tr className="bg-emerald-50/60 font-bold text-emerald-900">
                        <td className="p-1.5">Remaining Life</td>
                        <td className="p-1.5">1.43 Years</td>
                        <td className="p-1.5">(8.2 - 7.8) / 0.28</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : deliverableFormatTab === 'code' ? (
              <div className="space-y-2 text-xs font-mono">
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl overflow-x-auto text-[10px] leading-relaxed">
                  <pre>{`# Verified Python Calculation Script
def calc_hx204_integrity(t_act=8.2, t_min=7.8, cr=0.28):
    rem_life = (t_act - t_min) / cr
    sop_turnaround_max = 1.0 # 12 months
    requires_early_turnaround = rem_life < 1.5
    return {
        "remaining_life_years": round(rem_life, 2),
        "early_turnaround_required": requires_early_turnaround,
        "recommended_window": "Q1 2027"
    }

result = calc_hx204_integrity()
print(f"Verified Execution: {result}")
# Output: {'remaining_life_years': 1.43, 'early_turnaround_required': True, 'recommended_window': 'Q1 2027'}`}</pre>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs text-slate-800 leading-relaxed">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                  <div className="border-b pb-1.5 flex items-center justify-between">
                    <span className="font-extrabold text-blue-900 text-xs tracking-tight">FORMAL TECHNICAL APPROVAL NOTE</span>
                    <span className="font-mono text-[9px] text-slate-400">REF: MECH/2026/HX-204-APPR</span>
                  </div>

                  {/* Sentence 1 (Click -> Inspection Report p.4 per Shot 6) */}
                  <div 
                    onClick={() => openSourceViewer(1)}
                    className="p-2 rounded-lg border border-transparent hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all space-y-1 group"
                    title="Click sentence to inspect NDT Inspection Report source (Page 4)"
                  >
                    <p className="text-[11px] leading-relaxed">
                      <strong>1. Executive Summary:</strong> NDT ultrasonic thickness survey on Heat Exchanger HX-204 shell side reveals minimum wall thickness of <span className="inline-flex items-center gap-1 font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 group-hover:bg-blue-100">[8.2 mm (Doc: INSP/2026/HX-204 p.4)]</span> against original design thickness 12.5 mm (Retirement threshold: 7.8 mm).
                    </p>
                  </div>

                  {/* Sentence 2 (Click -> SOP-4.2.1 p.18 per Shot 5 & 6) */}
                  <div 
                    onClick={() => openSourceViewer(0)}
                    className="p-2 rounded-lg border border-rose-200 bg-rose-50/30 hover:border-rose-400 hover:bg-rose-50 cursor-pointer transition-all space-y-1 group"
                    title="Click sentence to inspect SOP-4.2.1 statutory compliance provenance (Page 18)"
                  >
                    <p className="text-[11px] leading-relaxed text-rose-950">
                      <strong>2. SOP Non-Conformance:</strong> Proposed field 18-month turnaround interval violates the 12-month limit mandated by <span className="inline-flex items-center gap-1 font-mono font-bold text-rose-800 bg-rose-100 px-1.5 py-0.2 rounded border border-rose-300 group-hover:bg-rose-200">[SOP-4.2.1 §7.1 (SOP p.18)]</span> for sour crude service.
                    </p>
                  </div>

                  {/* Sentence 3 (Click -> SOP-4.2.1 p.22 per Shot 6) */}
                  <div 
                    onClick={() => openSourceViewer(2)}
                    className="p-2 rounded-lg border border-transparent hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all space-y-1 group"
                    title="Click sentence to inspect tube bundle replacement limits (Page 22)"
                  >
                    <p className="text-[11px] leading-relaxed">
                      <strong>3. Recommendation:</strong> Advance turnaround window to Q1 2027 with pre-allocated tube bundle procurement per <span className="inline-flex items-center gap-1 font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 group-hover:bg-blue-100">[SOP-4.2.1 §4.3.4 (SOP p.22)]</span>.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ═══ APPROVAL, EXPORT & FEEDBACK DOCK ═══ */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200">
            
            {/* Primary Action: Route to Approver */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  showToast(
                    'Dispatched to Approver Queue',
                    'Technical Note MECH/2026/HX-204-APPR routed to Dr. Vikram Shetty for RSA-2048 digital signature.',
                    'success'
                  );
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit for Executive Sign-Off</span>
              </button>

              {/* PDF Signed Export */}
              <button
                onClick={() => {
                  if (currentTask?.deliverable) {
                    downloadApprovalNotePDF(currentTask.deliverable, currentUser.name);
                    showToast('PDF Exported', 'Downloaded signed approval note with SHA-256 audit ledger.', 'success');
                  }
                }}
                className="p-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer"
                title="Download Signed PDF Deliverable"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Secondary Export Actions: Word, Excel, PPT, SAP DMS */}
            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
              <button
                onClick={() => showToast('DOCX Exported', 'Generated Word Technical Approval Note.', 'info')}
                className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-center truncate cursor-pointer"
              >
                Word (.docx)
              </button>
              <button
                onClick={() => showToast('XLSX Exported', 'Generated Calculation Workbook with formulas.', 'info')}
                className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-center truncate cursor-pointer"
              >
                Excel (.xlsx)
              </button>
              <button
                onClick={() => showToast('Dispatched to SAP DMS', 'Pushed deliverable to /shares/sap/cdu03/.', 'success')}
                className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-center truncate cursor-pointer"
              >
                Send to SAP
              </button>
            </div>

            {/* Feedback & Training Signal */}
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[10px] text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Feedback:</span>
                <button 
                  onClick={() => showToast('Positive Feedback Recorded', 'Reinforcement signal captured locally.', 'success')}
                  className="p-1 hover:text-emerald-700 hover:bg-emerald-50 rounded cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => showToast('Negative Feedback Recorded', 'Flagged for local alignment fine-tuning.', 'warning')}
                  className="p-1 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => showToast('Flagged', 'Flagged citation for manual review.', 'info')}
                  className="p-1 hover:text-amber-700 hover:bg-amber-50 rounded cursor-pointer"
                  title="Flag hallucination / missing evidence"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-[9px] text-slate-500">
                <input
                  type="checkbox"
                  checked={trainingSignalOptIn}
                  onChange={(e) => setTrainingSignalOptIn(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Train Local Weights</span>
              </label>
            </div>

          </div>

        </div>
        )}

      </div>

      {/* Floating Retracted Edge Tab Handle */}
      {!isDeliverableStudioOpen && (
        <button
          onClick={() => setIsDeliverableStudioOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-30 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 px-2 rounded-l-xl shadow-xl border-l border-y border-blue-400 flex flex-col items-center gap-2 cursor-pointer transition-all hover:pr-3 animate-in fade-in duration-150"
          title="Open Live Deliverable Studio"
        >
          <ChevronLeft className="w-4 h-4 animate-pulse" />
          <span className="[writing-mode:vertical-rl] tracking-wider text-[10px] uppercase font-mono font-bold">
            Live Deliverable Studio
          </span>
        </button>
      )}

      {/* ────────────────────────────────────────────────────────────────
          PERSISTENT INDUSTRIAL STATUS STRIP (BOTTOM BAR PER SPEC)
         ──────────────────────────────────────────────────────────────── */}
      <div className="bg-slate-900 text-white px-4 py-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono z-20">
        
        {/* Left: Mode & Outbound Socket Monitor */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold">AIR-GAP MODE:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-green"></span>
              {systemMode} (SOVEREIGN)
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-slate-400 text-[11px]">
            <span>OUTBOUND SOCKETS:</span>
            <span className="font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800">
              0 (HARD AIR-GAP)
            </span>
          </div>
        </div>

        {/* Center: Model Routing & Latency */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>ACTIVE MODEL:</span>
            <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              Qwen2.5-VL-7B + DeepSeek-R1-Distill-70B
            </span>
          </div>
          <span className="text-slate-600">•</span>
          <span>DATA QUALITY: <strong className="text-emerald-400">99.2%</strong></span>
        </div>

        {/* Right: Limits & Knowledge Base Sync */}
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="hidden sm:inline">KB: 48 DOCS • SYNCED 4M AGO</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
            LIMIT: 100MB / 500 PGS
          </span>
        </div>

      </div>

      {/* ═══ MOUNTED DMS BROWSER MODAL ═══ */}
      {isDmsPickerOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider">Mounted DMS / SAP File Share</h3>
              </div>
              <button onClick={() => setIsDmsPickerOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-2 text-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                Mounted Location: /shares/dms/cdu03/
              </span>
              {[
                { name: 'inspection_report.pdf', size: '4.2 MB', desc: 'NDT Survey HX-204 Q3 2026' },
                { name: 'SOP_4.2.1.pdf', size: '2.8 MB', desc: 'Static Equipment Maintenance SOP' },
                { name: 'P&ID_Unit_03.png', size: '5.1 MB', desc: 'CDU-03 Pre-heat & Relief P&ID' },
                { name: 'vendor_bid.xlsx', size: '1.8 MB', desc: 'L&T Turnaround Commercial Quote' },
                { name: 'OISD_STD_129.pdf', size: '3.6 MB', desc: 'Inspection of Pressure Relieving Devices' },
              ].map((f) => (
                <div key={f.name} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-900 font-mono text-[11px]">{f.name}</h5>
                    <span className="text-[10px] text-slate-500">{f.desc} ({f.size})</span>
                  </div>
                  <button
                    onClick={() => {
                      if (!selectedFiles.includes(f.name)) {
                        setSelectedFiles(prev => [...prev, f.name]);
                        showToast('Document Mounted', `Mounted ${f.name} from DMS share.`, 'success');
                      }
                      setIsDmsPickerOpen(false);
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg cursor-pointer"
                  >
                    Mount File
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
