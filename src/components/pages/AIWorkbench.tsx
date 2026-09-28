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
import { downloadApprovalNotePDF, downloadSampleInspectionReportPDF } from '../../utils/exportUtils';

interface CitationItem {
  id: number;
  title: string;
  page?: string;
  confidence?: string;
  sourceIndex?: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  // 1. Agent Trace Strip
  traceSummary?: string;
  // 2. Dynamic Model Router Badge
  routedModel?: { name: string; taskType: string };
  // 3. Alerts & Scope Warning Panel
  alert?: { title: string; desc: string; type: 'warning' | 'danger' | 'info' };
  // 4. Code Block (for Question Type 3: Coding)
  codeBlock?: { language: string; code: string };
  // 5. Sandbox Execution Console (for Question Type 3: Coding)
  sandboxOutput?: {
    container: string;
    exitCode: number;
    executionTime: string;
    ram: string;
    network: string;
    rows?: { cml: string; current: string; rate: string; remLife: string; flagged?: boolean }[];
  };
  // 6. Multimodal Visual Graphic (for Question Type 4: Multimodal)
  multimodalGraphic?: {
    diagramName: string;
    highlightTag: string;
    lineRef: string;
    spec: string;
    confidence: string;
  };
  // 7. Grounded Citations & Sources Panel
  citations?: CitationItem[];
  // 8. Action Buttons Dock
  actions?: { label: string; actionKey: string; icon?: string }[];
  // 9. Sovereign Footer Strip
  footerMeta?: {
    model: string;
    latency: string;
    network: string;
    auditId: string;
  };
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
    content: 'What is the inspection interval for Class C corrosion?',
    timestamp: new Date(Date.now() - 1100000),
  },
  {
    id: 'ast-1',
    role: 'assistant',
    traceSummary: '🔍 Hybrid RAG Search → 📄 2 sources retrieved → ✅ Answer grounded',
    routedModel: { name: 'Qwen-2.5-14B', taskType: 'Document Lookup & RAG' },
    content: 'Class C corrosion requires statutory inspection every **12 months** [1].\nFor newly identified Corrosion Monitoring Locations (CMLs), a **6-month baseline** is mandated for the first operating year [2].',
    alert: {
      title: 'Scope Boundary Note',
      desc: 'Applies strictly to carbon steel service. For stainless steel or high-alloy metallurgy, see SOP-4.2.2.',
      type: 'warning'
    },
    citations: [
      { id: 1, title: 'SOP-4.2.1 §3.4', page: 'Page 12', confidence: '94%', sourceIndex: 0 },
      { id: 2, title: 'SOP-4.2.1 Table 2', page: 'Page 15', confidence: '91%', sourceIndex: 2 },
    ],
    actions: [
      { label: 'Download .pdf', actionKey: 'pdf' },
      { label: 'Submit for Sign-Off', actionKey: 'approve' }
    ],
    footerMeta: {
      model: 'Qwen-2.5-14B',
      latency: '2.3s',
      network: '0 outbound (Air-Gapped)',
      auditId: 'SF-AUD-2026-0927-001'
    },
    timestamp: new Date(Date.now() - 1050000),
  },
];

// Comprehensive Response bank supporting all 5 Question Types per Spec
const AI_RESPONSE_BANK: { keywords: string[]; buildResponse: (query: string) => Partial<ChatMessage> }[] = [
  // ─── Question Type 1: Document Question (RAG Lookup) ───
  {
    keywords: ['class c', 'inspection interval', 'corrosion interval', 'sop-4.2.1 §3.4', 'frequency'],
    buildResponse: () => ({
      traceSummary: '🔍 Hybrid RAG Search → 📄 2 sources retrieved → ✅ Answer grounded',
      routedModel: { name: 'Qwen-2.5-14B', taskType: 'Document Lookup & RAG' },
      content: 'Class C corrosion requires statutory inspection every **12 months** [1].\nFor newly identified Corrosion Monitoring Locations (CMLs), a **6-month baseline** is mandated for the first operating year [2].',
      alert: {
        title: 'Scope Boundary Note',
        desc: 'Applies strictly to carbon steel service. For stainless steel or high-alloy metallurgy, see SOP-4.2.2.',
        type: 'warning'
      },
      citations: [
        { id: 1, title: 'SOP-4.2.1 §3.4', page: 'Page 12', confidence: '94%', sourceIndex: 0 },
        { id: 2, title: 'SOP-4.2.1 Table 2', page: 'Page 15', confidence: '91%', sourceIndex: 2 }
      ],
      actions: [
        { label: 'Download .pdf', actionKey: 'pdf' },
        { label: 'Submit for Sign-Off', actionKey: 'approve' }
      ],
      footerMeta: {
        model: 'Qwen-2.5-14B',
        latency: '2.3s',
        network: '0 outbound (Air-Gapped)',
        auditId: `SF-AUD-2026-${Math.floor(10000 + Math.random() * 90000)}`
      }
    })
  },

  // ─── Question Type 3: Coding Question (Python Sandbox Execution) ───
  {
    keywords: ['python', 'script', 'code', 'calculate remaining', 'wall thickness', 'excel', 'pandas', 'flag'],
    buildResponse: () => ({
      traceSummary: 'Step 1: 📊 Read Excel (0.8s) → Step 2: 🧠 Route to Coder (0.2s) → Step 3: 💻 Code Gen (3.4s) → Step 4: 🐳 Sandbox Exec (2.1s) → Step 5: ✅ Verified (0.4s)',
      routedModel: { name: 'Qwen2.5-Coder-32B', taskType: 'Code Generation & Isolated Sandbox Execution' },
      content: 'Here is the auditable Python calculation script executed inside the isolated container (`python:3.11-slim`, `--network none`). All formulas strictly adhere to ASME Section VIII & SOP-4.2.1 §6.1:',
      codeBlock: {
        language: 'python',
        code: `import pandas as pd
THRESHOLD = 7.8  # Statutory retirement threshold (mm per SOP-4.2.1)

df = pd.read_excel("ut_readings.xlsx")
df["Corrosion_Rate"] = (df["Previous"] - df["Current"]) / 0.5
df["Remaining_Life"] = (df["Current"] - THRESHOLD) / df["Corrosion_Rate"]
df["Critical_Flag"] = df["Current"] <= (THRESHOLD + 0.5)

flagged = df[df["Critical_Flag"]]
print(f"Total CMLs Flagged for Immediate Action: {len(flagged)}")
print(flagged[["CML", "Current", "Corrosion_Rate", "Remaining_Life"]])`
      },
      sandboxOutput: {
        container: 'python:3.11-slim (Isolated Docker)',
        exitCode: 0,
        executionTime: '0.28s',
        ram: '42 MB',
        network: '0 bytes (Network: none)',
        rows: [
          { cml: 'CML-15', current: '6.1 mm', rate: '0.80 mm/yr', remLife: '0.00 yrs', flagged: true },
          { cml: 'CML-22', current: '6.3 mm', rate: '0.60 mm/yr', remLife: '0.00 yrs', flagged: true },
          { cml: 'HX204-C4', current: '8.2 mm', rate: '0.28 mm/yr', remLife: '1.43 yrs', flagged: true }
        ]
      },
      actions: [
        { label: 'Download .py', actionKey: 'pyscript' },
        { label: 'Download .xlsx', actionKey: 'xlsx' },
        { label: 'Re-run Sandbox', actionKey: 'rerun' }
      ],
      footerMeta: {
        model: 'Qwen2.5-Coder-32B',
        latency: '3.8s',
        network: '0 outbound (Air-Gapped)',
        auditId: `SF-AUD-2026-${Math.floor(10000 + Math.random() * 90000)}`
      }
    })
  },

  // ─── Question Type 4: Multimodal Question (P&ID Drawing Inspection) ───
  {
    keywords: ['valve tag', 'battery limit', '6"-cs-1501', 'p&id', 'drawing', 'psv-304', 'gv-1501', 'valve'],
    buildResponse: () => ({
      traceSummary: 'Step 1: 👁️ VLM Visual Analysis (4.8s, Qwen2.5-VL-72B @ 2400x1800) → Step 2: 🔍 RAG Cross-check (1.0s) → ✅ Tag Grounded',
      routedModel: { name: 'Qwen2.5-VL-72B-Vision', taskType: 'Multimodal Drawing OCR & Spatial Grounding' },
      content: 'The valve on line **6"-CS-1501** near the unit battery limit is **GV-1501** (Gate Valve, 6", 150# RF, Carbon Steel) [1].\n\nAdditionally, the primary pressure safety relief valve on the HX-204 shell inlet is **PSV-304** (Set Pressure: **14.2 kg/cm²g**, Design Margin: 110%) [2].',
      multimodalGraphic: {
        diagramName: 'P&ID Engineering Drawing: CDU-03 Complex (Rev C)',
        highlightTag: 'GV-1501 & PSV-304',
        lineRef: 'Line 6"-CS-1501 (Battery Limit)',
        spec: '6" Gate Valve, 150# RF, CS • Setpoint: 14.2 kg/cm²g',
        confidence: '94.2% OCR Spatial Confidence'
      },
      citations: [
        { id: 1, title: 'P&ID_CDU03_Unit_03.png', page: 'Battery Limit Area', confidence: '94.2%', sourceIndex: 1 },
        { id: 2, title: 'Master Valve Schedule Rev C', page: 'Row 42 (GV-1501)', confidence: '92.0%', sourceIndex: 2 }
      ],
      actions: [
        { label: 'Inspect P&ID Drawing', actionKey: 'drawing' },
        { label: 'Export Tag Card', actionKey: 'card' }
      ],
      footerMeta: {
        model: 'Qwen2.5-VL-72B-Vision',
        latency: '5.8s',
        network: '0 outbound (Air-Gapped)',
        auditId: `SF-AUD-2026-${Math.floor(10000 + Math.random() * 90000)}`
      }
    })
  },

  // ─── Question Type 5: Model Auto-Selection Proof (Decision Log) ───
  {
    keywords: ['router', 'auto-selection', 'decision log', 'model selection', 'routing proof', 'workload'],
    buildResponse: () => ({
      traceSummary: '🧠 Intent Classifier Engine → 🎯 Task Classification → 🚀 Local Model Dispatch',
      routedModel: { name: 'SovereignForge Dynamic Model Router', taskType: 'Zero-Egress Intelligent Workload Routing' },
      content: '**AIR-GAPPED DYNAMIC MODEL ROUTING AUDIT LOG**\n\nEvery prompt is classified locally by semantic intent and dispatched to the optimal specialized local neural model without any cloud egress:\n\n• **Query A:** *"Write Python script..."* ➔ **Intent:** Coding/Sandbox Math ➔ **Model:** `Qwen2.5-Coder-32B`\n• **Query B:** *"What is inspection interval..."* ➔ **Intent:** Document/RAG ➔ **Model:** `Qwen-2.5-14B`\n• **Query C:** *"What valve tag on P&ID..."* ➔ **Intent:** Multimodal Vision ➔ **Model:** `Qwen2.5-VL-72B`\n• **Query D:** *"Draft approval note & audit..."* ➔ **Intent:** Multi-Step Reasoning ➔ **Model:** `DeepSeek-R1 + Qwen-2.5-72B`\n\n🛡️ **Invariant:** Zero external internet requests. 100% on-premise execution.',
      citations: [
        { id: 1, title: 'Local Model Registry', page: '4 Models Active', confidence: '100%', sourceIndex: 0 },
        { id: 2, title: 'Network Egress Firewall Log', page: '0 Bytes Outbound', confidence: '100%', sourceIndex: 1 }
      ],
      footerMeta: {
        model: 'Local Model Router v2',
        latency: '0.12s',
        network: '0 outbound (Air-Gapped)',
        auditId: `SF-AUD-2026-${Math.floor(10000 + Math.random() * 90000)}`
      }
    })
  },

  // ─── Question Type 2 / Default Agentic Task ───
  {
    keywords: ['draft', 'approval', 'note', 'findings', 'turnaround', 'plan', 'sop', 'corrosion'],
    buildResponse: () => ({
      traceSummary: 'Step 1: 📄 OCR (PaddleOCR) → Step 2: 👁️ Vision (Qwen2.5-VL) → Step 3: 🔍 RAG (BGE-M3) → Step 4: 🧮 Math (SymPy) → Step 5: 🧠 Audit (R1) → Step 6: 📝 Draft (Qwen-2.5-72B)',
      routedModel: { name: 'DeepSeek-R1 + Qwen-2.5-72B', taskType: 'Multi-Step Autonomous Agent' },
      content: '**FORMAL TECHNICAL APPROVAL NOTE — CORROSION FINDINGS**\n*Ref: MECH/2026/HX-204-APPR*\n\n**1. Executive Summary:** NDT ultrasonic thickness survey on Heat Exchanger HX-204 shell side reveals minimum wall thickness of **8.2 mm** [1] against original design thickness 12.5 mm (Statutory retirement threshold: 7.8 mm).\n\n**2. SOP Non-Conformance:** Proposed field 18-month turnaround interval violates the 12-month limit mandated by **SOP-4.2.1 §7.1** [2] for sour crude service.\n\n**3. Recommendation:** Advance turnaround window to **Q1 2027** with pre-allocated tube bundle procurement per **SOP-4.2.1 §4.3.4** [3].',
      alert: {
        title: 'SOP Deviation Detected: +6M Overhaul Variance',
        desc: 'Proposed 18-month turnaround interval violates the 12-month limit mandated by SOP-4.2.1 §7.1 for sour crude service.',
        type: 'danger'
      },
      citations: [
        { id: 1, title: 'sample_inspection_report.pdf', page: 'Page 4 — Grid C4 NDT Data', confidence: '98.4%', sourceIndex: 1 },
        { id: 2, title: 'SOP-4.2.1 Rev 4', page: 'Page 18 (§7.1) — Sour Crude 12-Mo Limit', confidence: '96.1%', sourceIndex: 0 },
        { id: 3, title: 'SOP-4.2.1 Rev 4', page: 'Page 22 (§4.3.4) — Tube Bundle Replacement', confidence: '93.8%', sourceIndex: 2 }
      ],
      actions: [
        { label: 'Word (.docx)', actionKey: 'docx' },
        { label: 'Signed PDF', actionKey: 'pdf' },
        { label: 'Edit Draft', actionKey: 'edit' },
        { label: 'Submit for Sign-Off', actionKey: 'approve' }
      ],
      footerMeta: {
        model: 'Qwen2.5-VL ➔ DeepSeek-R1 ➔ Qwen-2.5-72B',
        latency: '12.4s',
        network: '0 outbound (Air-Gapped)',
        auditId: `SF-AUD-2026-${Math.floor(10000 + Math.random() * 90000)}`
      }
    })
  }
];

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

  // Unified Agent Execution Handler for Shot 4
  const handleExecuteAgent = (overridePrompt?: string) => {
    const rawPrompt = overridePrompt || chatInput.trim() || promptInput || 'Draft an approval note for the corrosion findings. Check against our SOPs.';
    const filesToUse = selectedFiles.length > 0 ? selectedFiles : ['sample_inspection_report.pdf', 'SOP_4.2.1.pdf'];

    if (selectedFiles.length === 0) {
      setSelectedFiles(filesToUse);
    }

    // Add user message to chat UI
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: rawPrompt,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAgentTraceExpanded(true); // Auto-expand trace panel immediately per Shot 4!
    
    runAgentTask(rawPrompt, filesToUse).then(() => {
      setIsDeliverableStudioOpen(true);
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        traceSummary: 'Step 1: 📄 OCR (PaddleOCR) → Step 2: 👁️ Vision (Qwen2.5-VL) → Step 3: 🔍 RAG (BGE-M3) → Step 4: 🧮 Math (SymPy) → Step 5: 🧠 Audit (R1) → Step 6: 📝 Draft (Qwen-2.5-72B)',
        routedModel: { name: 'DeepSeek-R1 + Qwen-2.5-72B', taskType: 'Autonomous Multi-Step Agent' },
        alert: {
          title: 'SOP Deviation Detected: +6M Overhaul Variance',
          desc: 'Proposed field 18-month turnaround interval violates the 12-month statutory limit mandated by SOP-4.2.1 §7.1 for sour crude service.',
          type: 'danger'
        },
        content: `**Autonomous Compliance Analysis Complete (7/7 Steps)**\n\n• **Ingested Document:** NDT Inspection Report (\`INSP/2026/HX-204-Q3\`) & \`SOP-4.2.1 Rev 4\`\n• **Measured Wall Thickness:** **8.2 mm** (Retirement Threshold: 7.8 mm, Remaining Life: ~1.43 yrs)\n• ⚠️ **Critical SOP Deviation:** Turnaround proposal (18 months) exceeds 12-month limit mandated by \`SOP-4.2.1 §7.1\` for sour crude service.\n• **Generated Output:** Formal Technical Approval Note (\`MECH/2026/HX-204-APPR\`) ready in Live Deliverable Studio.`,
        citations: [
          { id: 1, title: 'sample_inspection_report.pdf', page: 'Page 4 — Grid C4 NDT Data', confidence: '98.4%', sourceIndex: 1 },
          { id: 2, title: 'SOP-4.2.1 Rev 4', page: 'Page 18 (§7.1) — Sour Crude 12-Mo Limit', confidence: '96.1%', sourceIndex: 0 },
          { id: 3, title: 'SOP-4.2.1 Rev 4', page: 'Page 22 (§4.3.4) — Tube Bundle Replacement', confidence: '93.8%', sourceIndex: 2 }
        ],
        actions: [
          { label: 'Word (.docx)', actionKey: 'docx' },
          { label: 'Signed PDF', actionKey: 'pdf' },
          { label: 'Edit Draft', actionKey: 'edit' },
          { label: 'Submit for Sign-Off', actionKey: 'approve' }
        ],
        footerMeta: {
          model: 'Qwen2.5-VL ➔ DeepSeek-R1 ➔ Qwen-2.5-72B',
          latency: '12.4s',
          network: '0 outbound (Air-Gapped)',
          auditId: `SF-AUD-2026-${Math.floor(10000 + Math.random() * 90000)}`
        },
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    });
  };

  // Run full Agent pipeline from toolbar button
  const handleRunPipeline = () => {
    handleExecuteAgent();
  };

  // Send chat message or run agent if actionable
  const handleSendChat = () => {
    const trimmed = chatInput.trim();
    if (!trimmed || isAgentRunning || isChatTyping) return;

    // Check if input is an actionable multi-step agent directive
    const isMultiStepDirective = selectedFiles.length > 0 && 
      /draft|approval note|turnaround plan|generate deck/i.test(trimmed);

    if (isMultiStepDirective) {
      handleExecuteAgent(trimmed);
      return;
    }

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatTyping(true);

    const delay = 1000 + Math.random() * 600;
    setTimeout(() => {
      const lowerInput = trimmed.toLowerCase();
      const matched = AI_RESPONSE_BANK.find(r =>
        r.keywords.some(kw => lowerInput.includes(kw.toLowerCase()))
      );

      const responsePayload = matched ? matched.buildResponse(trimmed) : {
        traceSummary: '🔍 Hybrid RAG Search → 📄 2 sources retrieved → ✅ Answer grounded',
        routedModel: { name: 'Qwen-2.5-14B', taskType: 'Document Lookup & RAG' },
        content: `I've analyzed **"${trimmed}"** against the local indexed repository and static equipment SOPs.\n\nAll data is processed strictly on-premise with zero cloud egress. Click any citation below to inspect the verified source text.`,
        citations: [
          { id: 1, title: 'SOP-4.2.1 Rev 4', page: 'Page 12', confidence: '94%', sourceIndex: 0 },
          { id: 2, title: 'sample_inspection_report.pdf', page: 'Page 4', confidence: '98%', sourceIndex: 1 }
        ],
        actions: [
          { label: 'Download .pdf', actionKey: 'pdf' },
          { label: 'Submit for Sign-Off', actionKey: 'approve' }
        ],
        footerMeta: {
          model: 'Qwen-2.5-14B',
          latency: '1.8s',
          network: '0 outbound (Air-Gapped)',
          auditId: `SF-AUD-2026-${Math.floor(10000 + Math.random() * 90000)}`
        }
      };

      const aiMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date(),
        ...responsePayload
      } as ChatMessage;

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
            <button
              onClick={() => {
                downloadSampleInspectionReportPDF();
                showToast('Sample Report Downloaded', 'sample_inspection_report.pdf generated and saved to your Downloads.', 'success');
              }}
              className="w-full py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer border-0"
            >
              <Download className="w-3 h-3" />
              <span>Download Sample Report (.pdf)</span>
            </button>
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

                <div className={`max-w-[90%] md:max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md shadow-xs'
                    : msg.role === 'system'
                    ? 'bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-mono italic'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-md'
                }`}>
                  
                  {/* 1. Agent Trace Header Strip */}
                  {msg.traceSummary && (
                    <div className="mb-2 pb-1.5 border-b border-slate-100 flex items-center justify-between text-[10px] font-mono">
                      <span className="flex items-center gap-1.5 font-bold text-blue-700">
                        <Bot className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span className="truncate">{msg.traceSummary}</span>
                      </span>
                      <span className="text-[8px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-bold border border-emerald-200 flex-shrink-0 ml-2">
                        0 EGRESS
                      </span>
                    </div>
                  )}

                  {/* 2. Dynamic Model Router Badge */}
                  {msg.routedModel && (
                    <div className="mb-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-purple-50 border border-purple-200 text-[10px] font-mono font-bold text-purple-900">
                      <Cpu className="w-3 h-3 text-purple-600" />
                      <span>🧠 Routed to: <strong>{msg.routedModel.name}</strong> ({msg.routedModel.taskType})</span>
                    </div>
                  )}

                  {/* 3. Alerts & Scope Warning Panel */}
                  {msg.alert && (
                    <div className={`mb-2.5 p-2.5 rounded-xl border text-[11px] leading-snug flex items-start gap-2 ${
                      msg.alert.type === 'danger' 
                        ? 'bg-rose-50 border-rose-300 text-rose-950' 
                        : 'bg-amber-50 border-amber-300 text-amber-950'
                    }`}>
                      <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        msg.alert.type === 'danger' ? 'text-rose-600 animate-pulse' : 'text-amber-600'
                      }`} />
                      <div>
                        <strong className="block font-bold mb-0.5">{msg.alert.title}</strong>
                        <p>{msg.alert.desc}</p>
                      </div>
                    </div>
                  )}

                  {/* 4. Primary Prose Content */}
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

                  {/* 5. Code Block Component (Question Type 3: Coding Sandbox) */}
                  {msg.codeBlock && (
                    <div className="my-2.5 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden text-[10px] font-mono text-emerald-300 shadow-inner">
                      <div className="px-3 py-1.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5 font-bold">
                          <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                          <span>Python 3.11 Calculation Script</span>
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(msg.codeBlock?.code || '');
                            showToast('Code Copied', 'Copied Python script to clipboard.', 'success');
                          }}
                          className="text-[9px] hover:text-white text-slate-400 bg-slate-700 hover:bg-slate-600 px-2 py-0.5 rounded cursor-pointer transition-colors"
                        >
                          Copy Code
                        </button>
                      </div>
                      <pre className="p-3 overflow-x-auto leading-relaxed">
                        <code>{msg.codeBlock.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* 6. Sandbox Execution Output Console (Question Type 3) */}
                  {msg.sandboxOutput && (
                    <div className="my-2.5 rounded-xl bg-slate-950 border border-slate-800 p-3 text-[10px] font-mono text-slate-200 shadow-md space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-[9px] text-emerald-400 font-bold">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>SANDBOX CONTAINER: {msg.sandboxOutput.container}</span>
                        </span>
                        <span>EXIT CODE: {msg.sandboxOutput.exitCode} (SUCCESS)</span>
                      </div>

                      {msg.sandboxOutput.rows && msg.sandboxOutput.rows.length > 0 && (
                        <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/70">
                          <table className="w-full text-left text-[10px]">
                            <thead className="bg-slate-800/90 text-slate-300 text-[9px] uppercase">
                              <tr>
                                <th className="p-1.5">CML Location</th>
                                <th className="p-1.5">Measured</th>
                                <th className="p-1.5">Corrosion Rate</th>
                                <th className="p-1.5">Rem. Life</th>
                                <th className="p-1.5 text-right">Audit Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-[10px]">
                              {msg.sandboxOutput.rows.map((r, ri) => (
                                <tr key={ri} className={r.flagged ? 'bg-rose-950/40 text-rose-200' : 'text-slate-300'}>
                                  <td className="p-1.5 font-bold font-mono">{r.cml}</td>
                                  <td className="p-1.5">{r.current}</td>
                                  <td className="p-1.5">{r.rate}</td>
                                  <td className="p-1.5 font-bold">{r.remLife}</td>
                                  <td className="p-1.5 text-right font-bold">
                                    <span className="px-1.5 py-0.2 rounded bg-rose-900/90 text-rose-200 border border-rose-700 text-[9px]">
                                      CRITICAL ACTION
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-800">
                        <span>Execution: <strong>{msg.sandboxOutput.executionTime}</strong> • RAM: <strong>{msg.sandboxOutput.ram}</strong></span>
                        <span className="text-emerald-400 font-bold">{msg.sandboxOutput.network}</span>
                      </div>
                    </div>
                  )}

                  {/* 7. Multimodal Graphic Component (Question Type 4) */}
                  {msg.multimodalGraphic && (
                    <div className="my-2.5 rounded-xl border border-blue-200 bg-blue-50/40 p-3 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between text-[10px] font-bold text-blue-900 border-b border-blue-100 pb-1">
                        <span className="flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                          <span>{msg.multimodalGraphic.diagramName}</span>
                        </span>
                        <span className="text-[9px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200">
                          {msg.multimodalGraphic.confidence}
                        </span>
                      </div>

                      {/* Interactive P&ID Visual Schematic with Highlighted Tag */}
                      <div className="p-3 bg-white border border-slate-300 rounded-lg font-mono text-[11px] text-slate-800 relative overflow-hidden">
                        <div className="text-[9px] text-slate-400 mb-1">BATTERY LIMIT INTERCONNECT — LINE 6"-CS-1501</div>
                        <div className="flex items-center gap-3 my-2">
                          <div className="h-0.5 bg-slate-400 flex-1 relative">
                            <div className="absolute -top-3 left-4 text-[9px] font-bold text-slate-600">6"-CS-1501-A1A</div>
                          </div>
                          
                          {/* Highlighted Bounding Box Target */}
                          <div 
                            onClick={() => openSourceViewer(1)}
                            className="px-2.5 py-1.5 bg-blue-100 border-2 border-blue-500 rounded-lg text-blue-950 font-bold text-center cursor-pointer shadow-sm hover:bg-blue-200 transition-all group"
                            title="Click to zoom into P&ID Drawing Source"
                          >
                            <div className="text-[10px] text-blue-800 font-black flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                              {msg.multimodalGraphic.highlightTag}
                            </div>
                            <div className="text-[8px] text-blue-700 font-sans">{msg.multimodalGraphic.spec}</div>
                          </div>

                          <div className="h-0.5 bg-slate-400 flex-1"></div>
                        </div>
                        <div className="text-[9px] text-slate-500 italic mt-1 flex items-center justify-between">
                          <span>📍 Spatial Anchor: Coordinates (X: 1420, Y: 890)</span>
                          <span className="text-blue-600 font-bold hover:underline cursor-pointer" onClick={() => openSourceViewer(1)}>
                            [Click to inspect drawing]
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 8. Grounded Citations & Sources Shelf */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                        VERIFIED GROUNDED SOURCES:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {msg.citations.map((cite, i) => (
                          <button
                            key={i}
                            onClick={() => openSourceViewer(cite.sourceIndex ?? i)}
                            className="text-left p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all flex items-center justify-between cursor-pointer group"
                            title={`Open ${cite.title} in source viewer`}
                          >
                            <div className="min-w-0 pr-2">
                              <span className="font-bold text-[10px] text-slate-800 group-hover:text-blue-700 block truncate">
                                [{cite.id ?? i + 1}] {cite.title}
                              </span>
                              {cite.page && <span className="text-[9px] text-slate-500 block font-mono">{cite.page}</span>}
                            </div>
                            {cite.confidence && (
                              <span className="text-[8px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200 flex-shrink-0">
                                {cite.confidence}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 9. Action Buttons Dock */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                      {msg.actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (act.actionKey === 'pdf') {
                              if (currentTask?.deliverable) {
                                downloadApprovalNotePDF(currentTask.deliverable, currentUser.name);
                              } else {
                                downloadSampleInspectionReportPDF();
                              }
                              showToast('PDF Exported', 'Generated and saved PDF deliverable.', 'success');
                            } else if (act.actionKey === 'docx') {
                              showToast('Word Exported', 'Downloaded Word technical note (.docx).', 'info');
                            } else if (act.actionKey === 'pyscript') {
                              const blob = new Blob([msg.codeBlock?.code || ''], { type: 'text/x-python' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = 'calc_hx204_integrity.py';
                              a.click();
                              URL.revokeObjectURL(url);
                              showToast('Script Downloaded', 'Saved calc_hx204_integrity.py to Downloads.', 'success');
                            } else if (act.actionKey === 'approve') {
                              showToast('Dispatched to Approver', 'Routed to Dr. Vikram Shetty for RSA digital signature.', 'success');
                            } else if (act.actionKey === 'drawing') {
                              openSourceViewer(1);
                            } else {
                              showToast('Action Triggered', `Executed ${act.label}.`, 'info');
                            }
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                        >
                          <Download className="w-3 h-3" />
                          <span>{act.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 10. Cryptographic Sovereign Footer Strip */}
                  <div className={`mt-2 pt-1.5 border-t border-slate-100 text-[9px] font-mono flex items-center justify-between ${
                    msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}>
                    <span>{msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2">
                        {msg.footerMeta ? (
                          <>
                            <span>Model: <strong className="text-slate-600">{msg.footerMeta.model}</strong></span>
                            <span>• Latency: <strong>{msg.footerMeta.latency}</strong></span>
                            <span className="text-emerald-700 font-bold">• {msg.footerMeta.network}</span>
                            <span className="text-blue-700 font-bold">• {msg.footerMeta.auditId}</span>
                          </>
                        ) : (
                          <span>✓ Local GPU Verified (0 Egress)</span>
                        )}
                      </div>
                    )}
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
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs ${
                    isAgentTraceExpanded 
                      ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200' 
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'
                  }`}
                  title="Click to toggle full agent execution trace (Shot 4)"
                >
                  <span>{isAgentTraceExpanded ? '▲ Hide Steps' : `▼ Show Steps (${agentProgressStep}/7)`}</span>
                  {isAgentTraceExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Dynamic Model Router Badge (Shot 4 Hover Target) */}
              <div 
                className="group relative hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs cursor-help"
                title="Model Router dynamically assigns specialized local neural weights per step"
              >
                <span className="text-[9px] font-bold uppercase text-slate-400">ROUTER:</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border flex items-center gap-1 transition-all ${
                  agentProgressStep <= 2
                    ? 'bg-purple-50 text-purple-800 border-purple-200'
                    : agentProgressStep <= 5
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isAgentRunning ? 'bg-emerald-500 animate-ping' : 'bg-emerald-500'}`}></span>
                  {agentProgressStep <= 2 
                    ? '👁️ Vision (Qwen2.5-VL-72B)' 
                    : agentProgressStep <= 5 
                    ? '🧠 Reasoning (DeepSeek-R1)' 
                    : '✍️ Drafting (Qwen-2.5-72B)'}
                </span>

                {/* Model Router Hover Tooltip Card */}
                <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-72 p-3 bg-slate-900 text-white rounded-xl shadow-2xl text-[10px] font-mono z-30 border border-slate-700 pointer-events-none">
                  <div className="font-bold text-emerald-400 flex items-center justify-between pb-1.5 border-b border-slate-800">
                    <span>⚡ ACTIVE AIR-GAPPED WEIGHTS</span>
                    <span className="bg-emerald-950 text-emerald-400 px-1 rounded border border-emerald-800">0 EGRESS</span>
                  </div>
                  <div className="pt-2 space-y-1 text-slate-300">
                    <div>• <strong>Current Model:</strong> {agentProgressStep <= 2 ? 'Qwen2.5-VL-72B-Vision' : agentProgressStep <= 5 ? 'DeepSeek-R1-Distill-70B' : 'Qwen-2.5-72B-Instruct'}</div>
                    <div>• <strong>Active Hardware:</strong> 4x NVIDIA H100 SXM5 (Air-Gapped)</div>
                    <div>• <strong>VRAM Util:</strong> 42.4 GB / 320 GB • <strong>Latency:</strong> ~340ms</div>
                    <div>• <strong>Integrity Hash:</strong> SHA-256 Bit-Level Verified</div>
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
                      className="p-1 px-2 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Pause className="w-3 h-3" />
                      <span>{isAgentPaused ? 'Resume' : 'Pause'}</span>
                    </button>
                    <button
                      onClick={() => {
                        resetTaskToFresh();
                        showToast('Agent Stopped', 'Pipeline execution halted by user.', 'warning');
                      }}
                      className="p-1 px-2 rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Square className="w-3 h-3" />
                      <span>Stop</span>
                    </button>
                  </>
                )}
                <button
                  onClick={handleRunPipeline}
                  disabled={isAgentRunning}
                  className={`px-3 py-1 font-bold text-[11px] rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                    isAgentRunning
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  }`}
                  title="Run autonomous industrial agent pipeline"
                >
                  {isAgentRunning ? <RefreshCw className="w-3 h-3 animate-spin text-blue-600" /> : <Play className="w-3 h-3 fill-white" />}
                  <span>{isAgentRunning ? `Step ${agentProgressStep}/7...` : 'Run Agent'}</span>
                </button>
              </div>
            </div>

            {/* Step List Mini Progress Bar */}
            <div className="grid grid-cols-7 gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((s) => {
                const isCurrent = isAgentRunning && s === agentProgressStep;
                const isDone = s < agentProgressStep || (!isAgentRunning && agentProgressStep === 7);
                return (
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
                    className={`h-2 rounded-full transition-all ${
                      isCurrent
                        ? 'bg-blue-600 ring-2 ring-blue-400 animate-pulse'
                        : isDone
                        ? 'bg-emerald-600'
                        : 'bg-slate-200'
                    }`}
                  />
                );
              })}
            </div>

            {/* Detailed Expanded Steps (Shot 4 Viewer Reading Trace) */}
            {isAgentTraceExpanded && (
              <div className="pt-2 border-t border-slate-200/80 space-y-1.5 max-h-56 overflow-y-auto pr-1 text-xs">
                {[
                  { step: 1, title: 'Document OCR & Layout Table Parsing', model: 'PaddleOCR + Tesseract Engine', time: '140ms', detail: 'Extracted NDT ultrasonic table, shell thickness grid C4' },
                  { step: 2, title: 'P&ID Engineering Drawing Computer Vision', model: 'Qwen-2.5-VL-72B-Vision (Local)', time: '380ms', detail: 'Identified Heat Exchanger HX-204 shell nozzle N2 tag' },
                  { step: 3, title: 'Dense SOP RAG Retrieval & Vector Search', model: 'BAAI BGE-M3 (1024-dim dense)', time: '18ms', detail: 'Retrieved SOP-4.2.1 §7.1 and OISD-STD-129 overhaul clauses' },
                  { step: 4, title: 'API 510 Mathematical Formula Verification', model: 'Python SymPy Sandbox (Isolated)', time: '24ms', detail: 'Corrosion rate 0.28 mm/yr, remaining life 1.43 years' },
                  { step: 5, title: 'SOP Non-Conformance & Deviation Audit', model: 'DeepSeek-R1-Distill-70B (Local)', time: '410ms', detail: 'Flagged 18-month proposal against SOP 12-month sour crude statutory limit' },
                  { step: 6, title: 'Formal Technical Approval Note Synthesis', model: 'Qwen-2.5-72B-Instruct (Local)', time: '620ms', detail: 'Drafted 3-point executive note with strict source provenance' },
                  { step: 7, title: 'Cryptographic SHA-256 Ledger Attestation', model: 'Hardware HSM Root of Trust', time: '8ms', detail: 'Zero cloud egress invariant verified & tamper-evident signature generated' },
                ].map((st) => {
                  const isCurrent = isAgentRunning && st.step === agentProgressStep;
                  const isDone = st.step < agentProgressStep || (!isAgentRunning && agentProgressStep === 7);
                  
                  return (
                    <div 
                      key={st.step}
                      className={`p-2.5 rounded-xl border text-[11px] transition-all flex items-start justify-between gap-2 shadow-2xs ${
                        isCurrent
                          ? 'bg-blue-50/90 border-blue-400 text-blue-950 font-bold ring-2 ring-blue-400/30'
                          : isDone
                          ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                          : 'bg-white/60 border-slate-200 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold transition-all ${
                            isCurrent
                              ? 'bg-blue-600 text-white animate-pulse'
                              : isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {isCurrent ? (
                              <RefreshCw className="w-3 h-3 animate-spin text-white" />
                            ) : isDone ? (
                              <Check className="w-3 h-3 text-white" />
                            ) : (
                              st.step
                            )}
                          </span>
                          <span className={isCurrent ? 'text-blue-950 font-black' : ''}>{st.title}</span>
                          {isCurrent && (
                            <span className="text-[9px] font-mono font-bold uppercase bg-blue-600 text-white px-1.5 py-0.2 rounded animate-pulse">
                              RUNNING
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-sans pl-6">{st.detail}</p>
                      </div>

                      <div className="text-right font-mono text-[9px] flex-shrink-0">
                        <span className="text-blue-700 font-bold block">{st.model.split(' ')[0]}</span>
                        <span className="text-slate-400">{st.time}</span>
                      </div>
                    </div>
                  );
                })}
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

              {/* 1-Click Auto Attach Sample Report (For Shot 2 Demo) */}
              <button
                type="button"
                onClick={() => {
                  if (!selectedFiles.includes('sample_inspection_report.pdf')) {
                    setSelectedFiles(prev => [...prev, 'sample_inspection_report.pdf']);
                    showToast('Sample Report Attached', 'sample_inspection_report.pdf loaded with 98.4% OCR confidence.', 'success');
                  }
                }}
                className="h-9 px-2.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center gap-1.5 transition-all flex-shrink-0 cursor-pointer shadow-2xs"
                title="1-Click: Attach Sample Inspection Report for Shot 2 Demo"
              >
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Attach Sample PDF</span>
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

              {/* Send / Run Submit Button */}
              <button
                onClick={handleSendChat}
                disabled={!chatInput.trim() || isAgentRunning || isChatTyping}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                  chatInput.trim() && !isAgentRunning && !isChatTyping
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md ring-2 ring-blue-400/20'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
                title="Submit Directive & Run Autonomous Agent (Shot 4)"
              >
                {isAgentRunning ? <RefreshCw className="w-4 h-4 animate-spin text-blue-600" /> : <Send className="w-4 h-4" />}
              </button>

            </div>

            {/* Quick Starter Chips (5 Core Question Types per Spec) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex-shrink-0">Quick Demo:</span>
              {[
                { label: '📝 Agentic Task (Shot 3/4)', query: 'Draft an approval note for the corrosion findings. Check against our SOPs.' },
                { label: '📄 Type 1: RAG Question', query: 'What is the inspection interval for Class C corrosion?' },
                { label: '💻 Type 3: Coding Sandbox', query: 'Write a Python script to calculate remaining wall thickness and flag anything below 7.8mm.' },
                { label: '👁️ Type 4: Multimodal P&ID', query: 'What\'s the valve tag on line 6"-CS-1501 near the battery limit?' },
                { label: '🧠 Type 5: Router Proof', query: 'Show Model Auto-Selection Decision Log' },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setChatInput(item.query);
                    setTimeout(() => chatInputRef.current?.focus(), 50);
                  }}
                  className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[10px] font-semibold text-slate-700 hover:text-blue-700 whitespace-nowrap cursor-pointer transition-all shadow-2xs"
                  title={item.query}
                >
                  <span>{item.label}</span>
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
