import React, { useState } from 'react';
import { useApp, SystemStatusMode } from '../../context/AppContext';
import { 
  ShieldCheck, Lock, Activity, Users, Cpu, Database, CheckCircle2, 
  ArrowRight, AlertTriangle, RefreshCw, Power, Radio, ShieldAlert,
  Server, Zap, BarChart3, Download, FileText, FileSpreadsheet,
  PauseCircle, PlayCircle, XCircle, Sliders, HardDrive, Bell, Check,
  Flame, LockKeyhole, Undo2, Send, Terminal
} from 'lucide-react';

export const Overview: React.FC = () => {
  const { 
    navigateTo, 
    currentUser, 
    systemMode, 
    setSystemMode, 
    models, 
    tasks, 
    auditLogs, 
    showToast 
  } = useApp();

  // GPU Threshold slider states
  const [gpuTempThreshold, setGpuTempThreshold] = useState(78);
  const [gpuVramThreshold, setGpuVramThreshold] = useState(90);

  // Active Emergency States
  const [isKillSwitchActive, setIsKillSwitchActive] = useState(false);
  const [isLockdownActive, setIsLockdownActive] = useState(false);
  const [isAuditFrozen, setIsAuditFrozen] = useState(false);
  const [isNetworkIsolated, setIsNetworkIsolated] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // Core Service states
  const [services, setServices] = useState([
    { id: 'vllm', name: 'vLLM Model Server', port: 8000, status: 'ONLINE', latency: '42ms', uptime: '99.98%' },
    { id: 'qdrant', name: 'Qdrant Vector DB', port: 6333, status: 'ONLINE', latency: '12ms', uptime: '100.0%' },
    { id: 'redis', name: 'Redis Cache & Queue', port: 6379, status: 'ONLINE', latency: '2ms', uptime: '99.99%' },
    { id: 'postgres', name: 'PostgreSQL Audit Ledger', port: 5432, status: 'ONLINE', latency: '8ms', uptime: '100.0%' },
  ]);

  // Alert Feed State
  const [alerts, setAlerts] = useState([
    { id: 'alt-1', severity: 'warning', title: 'GPU 2 Temp Spike (74°C)', time: '12m ago', ack: false },
    { id: 'alt-2', severity: 'info', title: 'Dense vector index snapshot completed (14,280 vectors)', time: '45m ago', ack: true },
    { id: 'alt-3', severity: 'success', title: 'Automated cryptographic log hash verification PASSED', time: '1h ago', ack: true },
  ]);

  const handleRestartService = (serviceId: string, serviceName: string) => {
    showToast('Service Restart Initiated', `Restarting container ${serviceName}...`, 'info');
    setTimeout(() => {
      showToast('Service Online', `${serviceName} restarted and healthy on internal port.`, 'success');
    }, 1200);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, ack: true } : a));
    showToast('Alert Acknowledged', 'Alert acknowledged and logged in security ledger.', 'info');
  };

  // Emergency Control Handlers
  const handleToggleKillSwitch = () => {
    if (!isKillSwitchActive) {
      setIsKillSwitchActive(true);
      setSystemMode('SAFE');
      showToast('EMERGENCY KILL SWITCH ENGAGED', 'Immediately stopped all AI generation and tool execution across nodes.', 'error');
    } else {
      setIsKillSwitchActive(false);
      setSystemMode('FULL');
      showToast('Kill Switch Disengaged', 'AI generation restored to operational status.', 'success');
    }
  };

  const handleToggleLockdown = () => {
    setIsLockdownActive(!isLockdownActive);
    showToast(
      isLockdownActive ? 'Lockdown Disengaged' : 'LOCKDOWN ENGAGED',
      isLockdownActive ? 'System restored to normal mode.' : 'System restricted to read-only. No new tasks permitted.',
      isLockdownActive ? 'info' : 'warning'
    );
  };

  const handleRevokeAllTokens = () => {
    showToast('All Sessions Terminated', 'Force logged out all active user sessions and revoked RSA bearer tokens.', 'error');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    showToast('Broadcast Dispatched', `Broadcast message sent to all active terminals: "${broadcastMessage}"`, 'success');
    setBroadcastMessage('');
    setIsBroadcastModalOpen(false);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150 font-sans">
      
      {/* ═══ 1. ADMIN HEADER & MODE CONTROLLER ═══ */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              SOVEREIGN CONTROL PLANE
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Air-Gapped Root Governance
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Admin Command & Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time management of on-premise GPU clusters, service health, model servers, emergency controls, and compliance analytics.
          </p>
        </div>

        {/* Manual System Mode Switcher */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 pl-2">System Mode:</span>
          {(['FULL', 'DEGRADED', 'SAFE', 'OFFLINE'] as SystemStatusMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setSystemMode(mode);
                showToast('System Mode Shifted', `Manual override: System mode set to ${mode}.`, 'warning');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                systemMode === mode
                  ? mode === 'FULL'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : mode === 'DEGRADED'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : mode === 'SAFE'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ 2. GPU CLUSTER & SERVICE TELEMETRY (SECTION 1 OF SPEC) ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* GPU 1: NVIDIA A100-80GB (Vision OCR) */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <h4 className="font-bold text-xs text-slate-900">GPU 0: NVIDIA A100</h4>
            </div>
            <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
              HEALTHY
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Utilization</span>
              <span className="font-mono font-bold text-slate-900">74%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '74%' }}></div>
            </div>

            <div className="flex justify-between text-[11px] pt-1">
              <span className="text-slate-500">VRAM Usage</span>
              <span className="font-mono font-bold text-slate-900">62.4 / 80 GB</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Temp: <strong className="text-slate-900">62°C</strong></span>
              <span>Power: <strong className="text-slate-900">285W</strong></span>
            </div>
          </div>
        </div>

        {/* GPU 2: NVIDIA A100-80GB (Reasoning Model) */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              <h4 className="font-bold text-xs text-slate-900">GPU 1: NVIDIA A100</h4>
            </div>
            <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
              HEALTHY
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Utilization</span>
              <span className="font-mono font-bold text-slate-900">82%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: '82%' }}></div>
            </div>

            <div className="flex justify-between text-[11px] pt-1">
              <span className="text-slate-500">VRAM Usage</span>
              <span className="font-mono font-bold text-slate-900">68.1 / 80 GB</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Temp: <strong className="text-slate-900">66°C</strong></span>
              <span>Power: <strong className="text-slate-900">310W</strong></span>
            </div>
          </div>
        </div>

        {/* Active Concurrency & Queues */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-xs text-slate-900">Active Task Pipeline</h4>
            </div>
            <span className="text-[9px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-bold border border-blue-200">
              AIR-GAPPED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Tasks</span>
              <span className="text-xl font-mono font-extrabold text-slate-900">12</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Queue Depth</span>
              <span className="text-xl font-mono font-extrabold text-amber-600">3</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">Max Concurrent Limit: 32 tasks</span>
        </div>

        {/* Network & Zero Egress Proof */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-xs text-slate-900">Network Sockets</h4>
            </div>
            <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
              ZERO EGRESS
            </span>
          </div>

          <div className="space-y-1.5 pt-1 text-xs">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Outbound Connections</span>
              <span className="font-mono font-extrabold text-emerald-600">0 (LOCKED)</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Internal LAN Rx/Tx</span>
              <span className="font-mono text-slate-800">4.8 MB/s</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">iptables Rule Status</span>
              <span className="font-mono font-bold text-slate-900">Enforcing (DROP ALL)</span>
            </div>
          </div>
        </div>

      </div>

      {/* ═══ 3. CORE SERVICE HEALTH & RESTART CONTROLS (SECTION 1 OF SPEC) ═══ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-600" />
              Core On-Premise Service Architecture (Port Registry)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Microservices running locally on bare-metal air-gapped server cluster
            </p>
          </div>
          <button
            onClick={() => showToast('Cluster Health Checked', 'All 4 sovereign microservices responding within nominal SLA (<15ms).', 'success')}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Health Check All</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {services.map((srv) => (
            <div key={srv.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 leading-snug">{srv.name}</h4>
                  <span className="text-[10px] font-mono text-slate-400">Port {srv.port} • SLA {srv.uptime}</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px]">
                <span className="font-mono text-slate-500">Latency: <strong className="text-slate-800">{srv.latency}</strong></span>
                <button
                  onClick={() => handleRestartService(srv.id, srv.name)}
                  className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Restart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ 4. 🚨 EMERGENCY CONTROLS PANEL (SECTION 10 OF SPEC) ═══ */}
      <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-rose-950 uppercase tracking-tight">
                Emergency Controls & Incident Response (CISO Clearance)
              </h3>
              <p className="text-xs text-rose-800/90 mt-0.5">
                Immediate fail-closed actions for physical security, compromise containment, and forensic lockdown
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 text-[10px] font-mono font-bold">
            RESTRICTED TO CISO / SEC-ADMIN
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Kill Switch */}
          <button
            onClick={handleToggleKillSwitch}
            className={`p-3.5 rounded-xl border font-bold text-xs flex flex-col justify-between transition-all cursor-pointer ${
              isKillSwitchActive
                ? 'bg-rose-700 text-white border-rose-800 shadow-md animate-pulse'
                : 'bg-white hover:bg-rose-100/50 border-rose-300 text-rose-900 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-extrabold uppercase text-[11px]">🛑 AI Kill Switch</span>
              <Power className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-[10px] text-left opacity-80 mt-2 font-normal leading-tight">
              {isKillSwitchActive ? 'ACTIVE: All generation stopped' : 'Immediately halt all model inference & tool runs.'}
            </p>
          </button>

          {/* Lockdown Mode */}
          <button
            onClick={handleToggleLockdown}
            className={`p-3.5 rounded-xl border font-bold text-xs flex flex-col justify-between transition-all cursor-pointer ${
              isLockdownActive
                ? 'bg-amber-600 text-white border-amber-700 shadow-md'
                : 'bg-white hover:bg-amber-50 border-amber-300 text-amber-900 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-extrabold uppercase text-[11px]">🔒 Lockdown Mode</span>
              <LockKeyhole className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-[10px] text-left opacity-80 mt-2 font-normal leading-tight">
              {isLockdownActive ? 'ACTIVE: System in Read-Only' : 'Enforce read-only state. Block new task submissions.'}
            </p>
          </button>

          {/* Revoke All Tokens */}
          <button
            onClick={handleRevokeAllTokens}
            className="p-3.5 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 text-rose-900 font-bold text-xs flex flex-col justify-between shadow-2xs transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-extrabold uppercase text-[11px]">⚡ Revoke All Tokens</span>
              <Users className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-[10px] text-left text-slate-500 mt-2 font-normal leading-tight">
              Force logout all active users instantly and invalidate session keys.
            </p>
          </button>

          {/* Alert Broadcast */}
          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="p-3.5 rounded-xl border border-blue-300 bg-white hover:bg-blue-50 text-blue-900 font-bold text-xs flex flex-col justify-between shadow-2xs transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-extrabold uppercase text-[11px]">📢 System Broadcast</span>
              <Send className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-[10px] text-left text-slate-500 mt-2 font-normal leading-tight">
              Send emergency system banner to all active engineer terminals.
            </p>
          </button>

        </div>
      </div>

      {/* ═══ 5. REPORTING & ANALYTICS EXPORT (SECTION 11 OF SPEC) ═══ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Sovereign Reporting & Compliance Analytics Engine
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Export formal audit packages for management reviews and regulatory accreditation
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            ISO 42001 & EU AI ACT READY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Report 1: Usage & ROI */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h4 className="font-bold text-xs text-slate-900">Task Usage & ROI Report</h4>
            <p className="text-[11px] text-slate-500 leading-tight">
              Breakdown of 31 completed tasks across CDU-03 and FCCU with ~142 engineering hours saved.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => showToast('Report Generated', 'Downloaded Usage & ROI Report in PDF format.', 'success')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] font-bold text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" /> PDF
              </button>
              <button
                onClick={() => showToast('CSV Exported', 'Downloaded Raw Metrics CSV.', 'info')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] font-bold text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" /> CSV
              </button>
            </div>
          </div>

          {/* Report 2: Compliance & Policy Adherence */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h4 className="font-bold text-xs text-slate-900">Compliance & Guardrail Report</h4>
            <p className="text-[11px] text-slate-500 leading-tight">
              100% deterministic citation provenance verification and zero outbound packet audit.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => showToast('Report Generated', 'Downloaded ISO 42001 Compliance Report PDF.', 'success')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] font-bold text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" /> PDF
              </button>
              <button
                onClick={() => showToast('JSON Exported', 'Downloaded Full Policy Audit JSON.', 'info')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] font-bold text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" /> JSON
              </button>
            </div>
          </div>

          {/* Report 3: Model Performance & Accuracy */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h4 className="font-bold text-xs text-slate-900">Model Accuracy & Latency Report</h4>
            <p className="text-[11px] text-slate-500 leading-tight">
              Golden test benchmarking results across Qwen2.5-VL and DeepSeek-R1 inference engines.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => showToast('Report Generated', 'Downloaded Model Performance Report PDF.', 'success')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] font-bold text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" /> PDF
              </button>
              <button
                onClick={() => showToast('CSV Exported', 'Downloaded Raw Latency Log CSV.', 'info')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] font-bold text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" /> CSV
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ═══ 6. QUICK NAVIGATION CARDS TO ADMIN SUB-MODULES ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <div 
          onClick={() => navigateTo('admin-security')}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card hover:border-blue-400 transition-all cursor-pointer space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <ShieldAlert className="w-4.5 h-4.5" />
          </div>
          <h3 className="font-bold text-xs text-slate-900 uppercase">CISO Threat & Security Dashboard</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Zero-egress telemetry, failed auth logs, model weight hash checks, and incident response.
          </p>
        </div>

        <div 
          onClick={() => navigateTo('admin-roles')}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card hover:border-blue-400 transition-all cursor-pointer space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Users className="w-4.5 h-4.5" />
          </div>
          <h3 className="font-bold text-xs text-slate-900 uppercase">User Directory & RBAC Matrix</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Provision new employee accounts, manage Clearance Levels (L1-L5), and toggle module permissions.
          </p>
        </div>

        <div 
          onClick={() => navigateTo('admin-firewall')}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card hover:border-blue-400 transition-all cursor-pointer space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Lock className="w-4.5 h-4.5" />
          </div>
          <h3 className="font-bold text-xs text-slate-900 uppercase">AI Capability Firewall</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Granular agent guardrails on reading docs, writing files, code execution, and egress sockets.
          </p>
        </div>

        <div 
          onClick={() => navigateTo('admin-models')}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card hover:border-blue-400 transition-all cursor-pointer space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Cpu className="w-4.5 h-4.5" />
          </div>
          <h3 className="font-bold text-xs text-slate-900 uppercase">Local Model Registry & Routing</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Qwen2.5-VL, DeepSeek R1, BGE-M3 weight verification, USB upload, and task routing rules.
          </p>
        </div>

        <div 
          onClick={() => navigateTo('admin-network')}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card hover:border-blue-400 transition-all cursor-pointer space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
            <Activity className="w-4.5 h-4.5" />
          </div>
          <h3 className="font-bold text-xs text-slate-900 uppercase">Network Sovereignty & Zero Egress</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Hardware interface adapters, iptables drop verification, packet counters, and LAN isolation.
          </p>
        </div>

        <div 
          onClick={() => navigateTo('admin-audit')}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card hover:border-blue-400 transition-all cursor-pointer space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
            <Database className="w-4.5 h-4.5" />
          </div>
          <h3 className="font-bold text-xs text-slate-900 uppercase">Global Forensic Audit Ledger</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Immutable SHA-256 hash chains, export signed audit trails, and inspect provenance timelines.
          </p>
        </div>

      </div>

      {/* ═══ SYSTEM BROADCAST MODAL ═══ */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Send className="w-4 h-4 text-blue-600" />
              <span>Broadcast System Notification</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              This message will immediately display as a high-priority alert on all connected engineer sessions.
            </p>
            <form onSubmit={handleSendBroadcast} className="space-y-3">
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="E.g., Scheduled GPU cluster maintenance at 18:00 IST. Please save your tasks."
                rows={3}
                required
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700"
                >
                  Send Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
