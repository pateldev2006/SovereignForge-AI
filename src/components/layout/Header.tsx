import React, { useState } from 'react';
import { useApp, SystemStatusMode } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  ShieldCheck, Lock, ChevronDown, Sparkles, Check, 
  HelpCircle, Menu
} from 'lucide-react';
import { DEMO_USERS } from '../../data/mockData';

export const Header: React.FC<{ onToggleMobileMenu?: () => void }> = ({ onToggleMobileMenu }) => {
  const { 
    currentUser, 
    switchUser, 
    systemMode, 
    setSystemMode, 
    setIsSovereigntyModalOpen,
    startDemoTour,
    activePage,
    users
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const statusConfig: Record<SystemStatusMode, { label: string; dot: string; badge: string; desc: string }> = {
    FULL: {
      label: 'Operational',
      dot: 'bg-emerald-500',
      badge: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/60',
      desc: 'All on-premise AI models & vector pipelines operational'
    },
    DEGRADED: {
      label: 'Degraded',
      dot: 'bg-amber-500',
      badge: 'bg-amber-50/80 text-amber-700 border-amber-200/80 hover:bg-amber-100/60',
      desc: 'Vision OCR degraded; text reasoning remains active'
    },
    SAFE: {
      label: 'Safe Mode',
      dot: 'bg-rose-500',
      badge: 'bg-rose-50/80 text-rose-700 border-rose-200/80 hover:bg-rose-100/60',
      desc: 'Read-only mode; automated tool execution locked'
    },
    OFFLINE: {
      label: 'Air-Gap Offline',
      dot: 'bg-slate-500',
      badge: 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200/60',
      desc: 'AI generation offline; static documents accessible'
    }
  };

  const getPageTitle = () => {
    switch (activePage) {
      case 'workbench': return 'AI Task Composer';
      case 'tasks': return 'My Tasks';
      case 'documents': return 'Document Repository';
      case 'knowledge': return 'SOP Knowledge Base';
      case 'approvals': return 'Approval & Sign-Off';
      case 'reviews': return 'P&ID & SOP Review';
      case 'code-sandbox': return 'Code Sandbox';
      case 'audit-history': return 'Audit History';
      case 'admin-overview': return 'Control Center Overview';
      case 'admin-roles': return 'Roles & Permissions';
      case 'admin-firewall': return 'AI Capability Firewall';
      case 'admin-models': return 'Local Model Registry';
      case 'admin-policies': return 'Security Policies';
      case 'admin-security': return 'CISO Security Dashboard';
      case 'admin-network': return 'Network Sovereignty';
      case 'admin-audit': return 'Forensic Audit Ledger';
      default: return 'SovereignForge AI';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-xs">
      <div className="px-4 lg:px-6 h-15 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity & Location */}
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button 
              onClick={onToggleMobileMenu}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-sm leading-none">
                  SOVEREIGNFORGE<span className="text-blue-600">.AI</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/80 px-1.5 py-0.2 rounded leading-none">
                  AIR-GAPPED
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                On-Premise Industrial AI Workbench
              </p>
            </div>
          </div>

          <div className="hidden md:block h-5 w-px bg-slate-200 mx-1"></div>

          {/* Breadcrumb Context */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Workspace:</span>
            <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/70 text-[11px]">
              CDU-03 Complex
            </span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-blue-600 text-[11px]">
              {getPageTitle()}
            </span>
          </div>
        </div>

        {/* Right: Controls & Profile */}
        <div className="flex items-center gap-2">
          
          {/* 1. Persistent Sovereignty Status Pill */}
          <button
            onClick={() => setIsSovereigntyModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50/90 hover:bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all shadow-2xs group"
            title="Click to view detailed Air-Gap & Network Telemetry"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-green"></span>
            <span className="hidden xl:inline text-[11px] tracking-tight">ZERO OUTBOUND CONNECTIONS</span>
            <span className="xl:hidden text-[11px] font-mono">AIR-GAP</span>
            <Lock className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform ml-0.5" />
          </button>

          {/* 2. System Status Mode Badge (Dropdown) */}
          <div className="relative">
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${statusConfig[systemMode].badge}`}
              title="System Operating Mode"
            >
              <span className={`w-2 h-2 rounded-full ${statusConfig[systemMode].dot}`}></span>
              <span className="text-[11px] font-bold">{statusConfig[systemMode].label}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {isStatusDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setIsStatusDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">System Operating Mode</span>
                  <p className="text-xs text-slate-600 mt-0.5">Control on-premise AI failover states</p>
                </div>
                {(Object.keys(statusConfig) as SystemStatusMode[]).map((modeKey) => {
                  const cfg = statusConfig[modeKey];
                  return (
                    <button
                      key={modeKey}
                      onClick={() => {
                        setSystemMode(modeKey);
                        setIsStatusDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 text-xs transition-colors ${
                        systemMode === modeKey ? 'bg-slate-100 font-bold text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full mt-0.5 ${cfg.dot} flex-shrink-0`}></span>
                      <div>
                        <span className="font-bold block text-xs">{cfg.label}</span>
                        <span className="text-[11px] text-slate-500 font-normal leading-tight block">{cfg.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Demo Mode Badge */}
          <div 
            className="hidden 2xl:flex items-center gap-1 px-2 py-1 rounded bg-slate-100/90 border border-slate-200 text-slate-600 text-[10px] font-mono font-semibold"
            title="Prototype environment using simulated industrial data and telemetry."
          >
            <span>DEMO MODE</span>
            <HelpCircle className="w-3 h-3 text-slate-400" />
          </div>

          {/* 4. Guided Judge Demo Tour Launcher */}
          <button
            onClick={startDemoTour}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
            title="Launch step-by-step 3-minute evaluation walkthrough"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[11px]">Judge Demo Tour</span>
          </button>

          {/* 5. Demo Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-colors"
            >
              <div className="w-6.5 h-6.5 rounded-lg bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center">
                {currentUser.avatar || 'U'}
              </div>
              <div className="text-left hidden sm:block pr-1">
                <span className="font-bold text-slate-900 text-xs block leading-tight">{currentUser.name}</span>
                <span className="text-[10px] text-slate-500 font-medium block leading-none">{currentUser.roleTitle.split('—')[0].trim()}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isRoleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setIsRoleDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">DEMO ROLE SWITCHER</span>
                  <p className="text-xs text-slate-500 mt-0.5">Switch role to observe dynamic UI & RBAC adaptation</p>
                </div>

                <div className="py-2 space-y-1 max-h-[380px] overflow-y-auto">
                  {users.map((user) => {
                    const isSelected = currentUser.id === user.id;
                    return (
                      <button
                        key={user.id}
                        onClick={() => {
                          switchUser(user.id);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl flex items-start gap-3 transition-colors ${
                          isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {user.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 truncate">{user.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                          </div>
                          <span className="text-[11px] font-semibold text-blue-700 block mt-0.2">{user.roleTitle}</span>
                          <span className="text-[10px] text-slate-500 block truncate">{user.department}</span>
                          <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded mt-1 inline-block">
                            {user.clearanceLevel}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
