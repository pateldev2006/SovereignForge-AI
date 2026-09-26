import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/mockData';
import { UserRole } from '../../types';
import { ShieldCheck, Lock, ArrowRight, UserCheck, Key, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { switchUser, navigateTo, showToast, users } = useApp();
  const [employeeIdInput, setEmployeeIdInput] = useState('MRPL-ENG-10482');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [useSmartCard, setUseSmartCard] = useState(false);

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default to Plant Engineer
    switchUser('PlantEngineer');
    navigateTo('workbench');
    showToast('Authenticated Successfully', 'Connected to air-gapped MRPL SovereignForge instance.', 'success');
  };

  const handleQuickRoleLogin = (userIdOrRole: string, role: UserRole) => {
    switchUser(userIdOrRole);
    if (role === 'Approver') navigateTo('approvals');
    else if (role === 'CISO') navigateTo('admin-security');
    else if (role === 'ITEngineer') navigateTo('code-sandbox');
    else if (role === 'QAOfficer') navigateTo('reviews');
    else navigateTo('workbench');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 lg:p-8 font-sans">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 tracking-tight text-base leading-none block">
              SOVEREIGNFORGE<span className="text-blue-600">.AI</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium leading-none mt-0.5 block">
              Mangalore Refinery and Petrochemicals Limited (MRPL)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-green"></span>
          <span>● INTERNAL AIR-GAPPED INFRASTRUCTURE</span>
        </div>
      </div>

      {/* Main Login Area */}
      <div className="max-w-4xl mx-auto w-full my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Form: Enterprise Login */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-card p-8 space-y-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              ON-PREMISE ENVIRONMENT
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Secure Industrial AI Workbench
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Authenticate using your MRPL Employee Credentials or FIPS-140-3 Hardware Smart Card.
            </p>
          </div>

          <form onSubmit={handleStandardLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                MRPL Employee ID / Username
              </label>
              <input
                type="text"
                value={employeeIdInput}
                onChange={(e) => setEmployeeIdInput(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono font-semibold focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                placeholder="MRPL-ENG-10482"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                Domain Password / Token
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono font-semibold focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-center justify-between pt-1 text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useSmartCard}
                  onChange={(e) => setUseSmartCard(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-semibold text-[11px]">Hardware Smart Card SSO</span>
              </label>
              <span className="text-blue-700 font-bold hover:underline cursor-pointer">Helpdesk</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Authenticate to Sovereign Workbench</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Air-Gap Mode: <strong>ACTIVE</strong></span>
            <span>Zero Outbound Sockets</span>
          </div>
        </div>

        {/* Right Panel: Quick Demo Role Switcher for Evaluators */}
        <div className="lg:col-span-6 space-y-3">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
            <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>JUDGE / EVALUATOR QUICK ROLES</span>
            </div>
            <p className="text-xs text-blue-800/90 mt-1 leading-relaxed">
              Click any demo role below to instantaneously test dynamic UI permissions, RBAC filtering, and workflows:
            </p>
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => handleQuickRoleLogin(user.id, user.role)}
                className="w-full text-left p-3.5 bg-white hover:bg-blue-50/80 rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {user.avatar || user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-900">{user.name}</h4>
                    <span className="text-[11px] font-semibold text-blue-700 block">{user.roleTitle}</span>
                    <span className="text-[10px] text-slate-500">{user.department}</span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full text-center text-xs text-slate-400 font-medium">
        MRPL Confidential Industrial AI Prototype • Powered by SovereignForge AI On-Premise Engine • Zero Data Egress
      </div>

    </div>
  );
};
