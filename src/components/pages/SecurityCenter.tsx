import React from 'react';
import { useApp } from '../../context/AppContext';
import { AccessDenied } from '../common/AccessDenied';
import { 
  Lock, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, Key, Bug, Server, EyeOff
} from 'lucide-react';

export const SecurityCenter: React.FC = () => {
  const { securityAlerts, currentUser, hasPermission } = useApp();

  if (!currentUser || !hasPermission(currentUser.role, 'security')) {
    return <AccessDenied />;
  }

  const securityStatuses = [
    { title: 'Multi-Factor Auth (MFA)', status: 'Enabled', icon: <Key className="w-4 h-4 text-emerald-400" /> },
    { title: 'Role-Based Access (RBAC)', status: 'Active', icon: <Lock className="w-4 h-4 text-emerald-400" /> },
    { title: 'External API Access', status: 'Blocked', icon: <EyeOff className="w-4 h-4 text-emerald-400" /> },
    { title: 'Internet Access', status: 'Blocked', icon: <Server className="w-4 h-4 text-emerald-400" /> },
    { title: 'Audit Logging Engine', status: 'Active', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
    { title: 'Data Export Protection', status: 'Active', icon: <Lock className="w-4 h-4 text-emerald-400" /> },
    { title: 'Prompt Injection Defense', status: 'Active', icon: <Bug className="w-4 h-4 text-emerald-400" /> },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-rose-400 mb-1">
            <Lock className="w-4 h-4" /> Sovereign Cyber Perimeter
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Security Control & Threat Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time defensive posture matrix, prompt injection filters, and security alert log.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
            AIR-GAP THREAT DEFENSE ACTIVE
          </span>
        </div>
      </div>

      {/* Security Status Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" /> Enforced Security Defenses
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {securityStatuses.map((sec, idx) => (
            <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  {sec.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{sec.title}</h4>
                  <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                    {sec.status}
                  </span>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Security Alerts Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl backdrop-blur">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2 font-mono">
            <ShieldAlert className="w-5 h-5 text-rose-400" /> Active Security Alerts ({securityAlerts.length})
          </h3>
        </div>

        <div className="space-y-3">
          {securityAlerts.map(alert => (
            <div 
              key={alert.id} 
              className={`p-4 rounded-2xl border text-xs space-y-2 transition-all ${
                alert.severity === 'High' ? 'bg-rose-950/40 border-rose-500/50 glow-red' :
                alert.severity === 'Medium' ? 'bg-amber-950/30 border-amber-500/40' :
                'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                    alert.severity === 'High' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    alert.severity === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-blue-500/20 text-blue-300'
                  }`}>
                    {alert.severity} SEVERITY
                  </span>
                  <h4 className="font-bold text-white text-sm">{alert.title}</h4>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{alert.timestamp}</span>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed">{alert.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
