import React from 'react';
import { useApp } from '../../context/AppContext';
import { AccessDenied } from '../common/AccessDenied';
import { 
  Users, Activity, FileText, MessageSquareCode, ShieldAlert, CheckSquare, 
  Server, Cpu, Database, Eye, Bot, ShieldCheck, ArrowUpRight, Clock
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { currentUser, hasPermission, navigateTo, approvals, securityAlerts, documents } = useApp();

  if (!currentUser || !hasPermission(currentUser.role, 'dashboard')) {
    return <AccessDenied />;
  }

  // Simulated chart data
  const requestsOverTimeData = [
    { time: '08:00', requests: 120 },
    { time: '10:00', requests: 340 },
    { time: '12:00', requests: 520 },
    { time: '14:00', requests: 410 },
    { time: '16:00', requests: 680 },
    { time: '18:00', requests: 390 },
    { time: '20:00', requests: 210 },
  ];

  const docsProcessedData = [
    { dept: 'Maintenance', count: 4200 },
    { dept: 'Safety', count: 3100 },
    { dept: 'Operations', count: 3800 },
    { dept: 'Cyber Ops', count: 1742 },
  ];

  const securityEventsData = [
    { name: 'RBAC Access Denied', value: 4, color: '#f43f5e' },
    { name: 'Prompt Injection', value: 2, color: '#f59e0b' },
    { name: 'Integrity Check', value: 1, color: '#06b6d4' },
  ];

  const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending').length;

  const healthCards = [
    { title: 'Local AI Model', status: 'ONLINE', detail: 'Industrial LLM v2.1 (94.2% Eval)', icon: <Server className="w-5 h-5" />, color: 'emerald' },
    { title: 'Vector Database', status: 'ONLINE', detail: '12,842 Index Vectors (Milvus Local)', icon: <Database className="w-5 h-5" />, color: 'emerald' },
    { title: 'Vision Model', status: 'ONLINE', detail: 'Equipment Transformer v1.4', icon: <Eye className="w-5 h-5" />, color: 'emerald' },
    { title: 'Agent Engine', status: 'ONLINE', detail: 'Multi-Agent Orchestrator v2.0', icon: <Bot className="w-5 h-5" />, color: 'emerald' },
    { title: 'Audit Service', status: 'ONLINE', detail: 'Immutable SHA-256 Ledger', icon: <ShieldCheck className="w-5 h-5" />, color: 'emerald' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-400 mb-1">
            <ShieldCheck className="w-4 h-4" /> Sovereign Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Administrator System Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time operational telemetry for local air-gapped AI clusters and data governance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('audit-logs')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-all border border-slate-700 flex items-center gap-2"
          >
            <Clock className="w-4 h-4 text-cyan-400" /> View Audit Logs
          </button>
          <button
            onClick={() => navigateTo('policies')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md glow-cyan flex items-center gap-2"
          >
            Manage Policies <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 6 KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-semibold">Total Users</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">248</div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">Active RBAC Profiles</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-semibold">Active Sessions</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">31</div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">Concurrent Encrypted Nodes</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-semibold">Documents</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">12,842</div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">{documents.length} Local Cataloged</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-semibold">AI Requests Today</span>
            <MessageSquareCode className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">1,842</div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">+14.2% vs baseline</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-semibold">Security Alerts</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 font-mono">7</div>
          <div className="text-[10px] text-rose-400 mt-1 font-mono">{securityAlerts.filter(a => !a.resolved).length} Action Required</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-semibold">Pending Approvals</span>
            <CheckSquare className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">{pendingApprovalsCount || 12}</div>
          <div className="text-[10px] text-amber-400 mt-1 font-mono">Awaiting Human Signoff</div>
        </div>
      </div>

      {/* System Health Status Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-mono uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" /> System Health Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {healthCards.map((card, idx) => (
            <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-slate-950 text-cyan-400 border border-slate-800">
                  {card.icon}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {card.status}
                </div>
              </div>
              <h4 className="font-bold text-white text-sm">{card.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-tight">{card.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Requests Over Time */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">AI Requests Over Time</h3>
              <p className="text-xs text-slate-400">Local inference query volume (24 Hours)</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold">
              Peak: 680 req/hr
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={requestsOverTimeData}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="requests" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorReq)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Documents Processed by Department */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Documents Processed by Department</h3>
              <p className="text-xs text-slate-400">Classification & RAG Vector index count</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-mono font-semibold">
              Total: 12,842 Docs
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={docsProcessedData}>
                <XAxis dataKey="dept" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Security Events & Approvals Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Events Pie */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" /> Security Event Distribution
          </h3>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={securityEventsData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                  {securityEventsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 font-mono text-xs">
            {securityEventsData.map((e, idx) => (
              <div key={idx} className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }}></span>
                  {e.name}
                </span>
                <span className="font-bold">{e.value} events</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Pending Approvals Queue */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-amber-400" /> Urgent Approval Queue
            </h3>
            <button 
              onClick={() => navigateTo('approvals')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-semibold"
            >
              View All Approvals →
            </button>
          </div>

          <div className="space-y-3">
            {approvals.slice(0, 2).map(appr => (
              <div key={appr.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {appr.riskLevel} Risk Recommendation
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">{appr.title}</h4>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{appr.dateTime}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{appr.recommendation}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">Requested by: {appr.requestingUser} ({appr.requestingRole})</span>
                  <button 
                    onClick={() => navigateTo('approvals')}
                    className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors"
                  >
                    Review Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
