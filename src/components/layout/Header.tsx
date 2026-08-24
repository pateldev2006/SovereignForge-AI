import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, Wifi, WifiOff, Bell, Search, LogOut, 
  Menu, User as UserIcon, ChevronDown, Check, ShieldAlert
} from 'lucide-react';
import { UserRole } from '../../types';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { 
    currentUser, 
    logout, 
    switchUserRole, 
    isInternetSimulatedOffline, 
    toggleInternetDisconnection,
    securityAlerts
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showAlertsMenu, setShowAlertsMenu] = useState(false);

  const roles: UserRole[] = ['Administrator', 'Engineer', 'Manager', 'Maintenance', 'Operations', 'Safety'];

  const unresolvedAlerts = securityAlerts.filter(a => !a.resolved);

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Sovereign Mode Indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Sovereign Mode Banner */}
        <div className="flex items-center gap-2">
          {!isInternetSimulatedOffline ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold font-mono glow-emerald">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <ShieldCheck className="w-3.5 h-3.5 hidden sm:inline" />
              <span>SOVEREIGN MODE ACTIVE</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold font-mono">
              <WifiOff className="w-3.5 h-3.5" />
              <span>OFFLINE MODE (AIR-GAPPED)</span>
            </div>
          )}

          {/* Toggle Internet Disconnection */}
          <button
            onClick={toggleInternetDisconnection}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 transition-all flex items-center gap-1.5"
            title="Simulate network isolation"
          >
            {isInternetSimulatedOffline ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="hidden md:inline">Connect Link</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span className="hidden md:inline">Simulate Air-Gap</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Center: Quick Search (Desktop) */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search confidential documents, pumps, SOPs..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right: Security Notifications & User Info */}
      <div className="flex items-center gap-3">
        {/* Alerts Bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsMenu(!showAlertsMenu)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unresolvedAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unresolvedAlerts.length}
              </span>
            )}
          </button>

          {/* Alerts Dropdown */}
          {showAlertsMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-scale-in">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
                <h4 className="text-xs font-mono uppercase font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" /> Security Alerts ({securityAlerts.length})
                </h4>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {securityAlerts.map(alert => (
                  <div key={alert.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold ${
                        alert.severity === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        alert.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                    </div>
                    <h5 className="font-semibold text-white mb-0.5">{alert.title}</h5>
                    <p className="text-slate-400 text-[11px] leading-tight">{alert.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Role Switcher */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-xs font-bold font-mono">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                  {currentUser.name}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                  <span>{currentUser.role}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
              </div>
            </button>

            {/* Role Switcher Menu */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50">
                <div className="p-2 border-b border-slate-800 mb-2">
                  <div className="text-xs font-semibold text-white">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-400">{currentUser.email}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">{currentUser.department}</div>
                </div>

                <div className="text-[10px] font-mono uppercase text-slate-500 px-2 mb-1 font-bold">
                  Switch Active Role (RBAC Demo)
                </div>

                <div className="space-y-1 mb-2">
                  {roles.map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        switchUserRole(r);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        currentUser.role === r 
                          ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30' 
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{r}</span>
                      {currentUser.role === r && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out Session
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => switchUserRole('Administrator')}
            className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-all shadow-md"
          >
            Log In
          </button>
        )}
      </div>
    </header>
  );
};
