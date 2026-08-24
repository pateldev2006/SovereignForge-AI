import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/mockData';
import { ShieldCheck, Lock, Mail, ArrowRight, Server, Shield, CheckCircle2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('admin@sovereignforge.local');
  const [password, setPassword] = useState('admin123');
  const [selectedDemoIndex, setSelectedDemoIndex] = useState<number>(0);

  const handleSelectDemo = (index: number) => {
    setSelectedDemoIndex(index);
    const demo = DEMO_USERS[index];
    setEmail(demo.email);
    setPassword(demo.email.split('@')[0] + '123');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Glow Overlay */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10">
        
        {/* Left: Branding & Specs */}
        <div className="flex flex-col justify-between space-y-6 md:border-r md:border-slate-800 md:pr-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg glow-cyan">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white font-mono leading-none">
                  SOVEREIGNFORGE AI
                </h1>
                <p className="text-xs text-cyan-400 font-mono tracking-wider uppercase mt-1">
                  Sovereign Intelligence. Controlled by You.
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Air-gapped on-premise AI workbench for confidential industrial data, equipment diagnostics, and automated agent safety compliance.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero External Data Leakage</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cryptographic SHA-256 Audit Integrity</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Enforced Role-Based Access Control (RBAC)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mandatory Human-in-the-Loop Approvals</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Server className="w-3.5 h-3.5" /> AIR-GAPPED NODE
              </span>
              <span className="text-slate-500">v2.4-PROD</span>
            </div>
            <p className="text-[11px] text-slate-400">
              All LLM parameters and embedding vectors are executing locally on hardware cluster node <code className="text-cyan-300 font-mono">SOV-NODE-01</code>.
            </p>
          </div>
        </div>

        {/* Right: Quick Demo Accounts & Login Form */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" /> Demo Authentication
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Select a pre-configured industrial profile to test RBAC permissions.
            </p>

            {/* Demo Account Cards */}
            <div className="space-y-2 mb-6">
              {DEMO_USERS.map((user, idx) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectDemo(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                    selectedDemoIndex === idx
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs font-mono ${
                      user.role === 'Administrator' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      user.role === 'Manager' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">{user.name}</div>
                      <div className="text-[10px] text-slate-400">{user.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      user.role === 'Administrator' ? 'bg-purple-500/20 text-purple-300' :
                      user.role === 'Manager' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {user.role}
                    </span>
                    <div className="text-[9px] text-slate-500 mt-0.5">{user.department.split(' ')[0]}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Corporate Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Passcode</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-lg glow-cyan"
              >
                Authenticate & Enter Workbench <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="text-center text-[10px] text-slate-500 font-mono">
            Protected by SovereignForge AI Security Engine • RBAC Active
          </div>
        </div>

      </div>
    </div>
  );
};
