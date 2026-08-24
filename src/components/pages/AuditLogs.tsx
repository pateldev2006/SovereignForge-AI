import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AccessDenied } from '../common/AccessDenied';
import { 
  FileSpreadsheet, Search, Filter, ShieldAlert, CheckCircle2, Lock, AlertTriangle, XCircle, Clock
} from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const { auditLogs, currentUser, hasPermission } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterResult, setFilterResult] = useState<string>('All');

  if (!currentUser || !hasPermission(currentUser.role, 'audit-logs')) {
    return <AccessDenied />;
  }

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.resource.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesResult = filterResult === 'All' || log.result === filterResult;
    return matchesSearch && matchesResult;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-emerald-400 mb-1">
            <FileSpreadsheet className="w-4 h-4" /> Cryptographic Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Immutable Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete tamper-evident audit trail of system events, queries, approvals, and security blocks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
            TOTAL LOGS: {auditLogs.length}
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by user, action, or resource..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold shrink-0">Result:</span>
          {['All', 'Success', 'Denied', 'Violation', 'Blocked', 'Pending'].map(res => (
            <button
              key={res}
              onClick={() => setFilterResult(res)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                filterResult === res
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {res}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table / Mobile Cards */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur">
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] font-mono uppercase font-bold text-slate-400">
                <th className="p-4">Timestamp</th>
                <th className="p-4">User & Role</th>
                <th className="p-4">Action</th>
                <th className="p-4">Resource Target</th>
                <th className="p-4">Result Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-4">
                    <div className="font-semibold text-white">{log.user}</div>
                    <div className="text-[10px] text-cyan-400">{log.role}</div>
                  </td>
                  <td className="p-4 text-slate-200 font-semibold">{log.action}</td>
                  <td className="p-4 text-slate-400 truncate max-w-xs">{log.resource}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      log.result === 'Success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      log.result === 'Denied' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      log.result === 'Violation' ? 'bg-rose-600 text-white font-bold animate-pulse' :
                      log.result === 'Blocked' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {log.result.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-slate-800">
          {filteredLogs.map(log => (
            <div key={log.id} className="p-4 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  log.result === 'Success' ? 'bg-emerald-500/20 text-emerald-300' :
                  log.result === 'Denied' ? 'bg-rose-500/20 text-rose-300' :
                  'bg-amber-500/20 text-amber-300'
                }`}>
                  {log.result}
                </span>
              </div>
              <div className="font-bold text-white text-sm">{log.action}</div>
              <div className="text-slate-400 font-mono text-[11px]">{log.user}</div>
              <div className="text-slate-500 text-[11px]">Resource: {log.resource}</div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
