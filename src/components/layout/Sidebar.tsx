import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';
import { 
  LayoutDashboard, MessageSquareCode, FileText, Camera, ShieldCheck, 
  Activity, CheckSquare, BarChart3, Users, Network, Cpu, Bot, Wrench, 
  Sliders, Database, FileSpreadsheet, Lock, Sparkles, Terminal, X, ChevronRight, Layers, Bug
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface MenuItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
  adminOnly?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { activePage, navigateTo, currentUser, hasPermission, approvals } = useApp();

  const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending').length;

  const mainNavItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'workbench', label: 'AI Workbench', icon: <MessageSquareCode className="w-4 h-4 text-cyan-400" /> },
    { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
    { id: 'image-analysis', label: 'Image Analysis', icon: <Camera className="w-4 h-4" /> },
    { id: 'investigations', label: 'Investigations', icon: <Activity className="w-4 h-4" /> },
    { id: 'sensor-data', label: 'Sensor Data', icon: <Cpu className="w-4 h-4" /> },
    { id: 'approvals', label: 'Approvals', icon: <CheckSquare className="w-4 h-4" />, badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const adminNavItems: MenuItem[] = [
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" />, adminOnly: true },
    { id: 'roles-departments', label: 'Roles & Departments', icon: <Network className="w-4 h-4" />, adminOnly: true },
    { id: 'models', label: 'AI Models', icon: <Sparkles className="w-4 h-4" />, adminOnly: true },
    { id: 'agents', label: 'Agents', icon: <Bot className="w-4 h-4" />, adminOnly: true },
    { id: 'tools', label: 'Tools', icon: <Wrench className="w-4 h-4" />, adminOnly: true },
    { id: 'policies', label: 'AI Policy Engine', icon: <Sliders className="w-4 h-4 text-amber-400" />, adminOnly: true },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: <Database className="w-4 h-4" />, adminOnly: true },
    { id: 'audit-logs', label: 'Audit Logs', icon: <FileSpreadsheet className="w-4 h-4 text-emerald-400" />, adminOnly: true },
    { id: 'security', label: 'Security Center', icon: <Lock className="w-4 h-4 text-rose-400" />, adminOnly: true },
    { id: 'architecture', label: 'System Architecture', icon: <Layers className="w-4 h-4 text-cyan-300" /> },
    { id: 'prompt-injection', label: 'Prompt Injection Demo', icon: <Bug className="w-4 h-4 text-purple-400" /> },
  ];

  const renderNavGroup = (title: string, items: MenuItem[]) => (
    <div className="mb-6">
      <div className="px-3 mb-2 text-[10px] font-mono uppercase font-bold tracking-widest text-slate-500 flex items-center justify-between">
        <span>{title}</span>
      </div>
      <div className="space-y-1">
        {items.map(item => {
          const isAllowed = currentUser ? hasPermission(currentUser.role, item.id) : false;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                navigateTo(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm font-semibold'
                  : isAllowed
                  ? 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                  : 'text-slate-600 hover:text-slate-400 hover:bg-slate-900/40 opacity-70'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-2">
                {!isAllowed && (
                  <Lock className="w-3 h-3 text-slate-600 group-hover:text-rose-400 transition-colors" />
                )}
                {item.badge !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isActive 
                      ? 'bg-cyan-400 text-slate-950' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 py-3 mb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg glow-cyan">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white font-mono leading-none">
                SOVEREIGNFORGE
              </h2>
              <span className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase">
                AI WORKBENCH
              </span>
            </div>
          </div>
          {/* Mobile close button */}
          <button 
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Groups */}
        {renderNavGroup('Core Product', mainNavItems)}
        {renderNavGroup('Control & Governance', adminNavItems)}
      </div>

      {/* Footer System Status Info */}
      <div className="mt-auto pt-4 border-t border-slate-800/80 text-xs">
        <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Node Status</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> ONLINE
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Air-Gapped Sovereign Cluster v2.4 • Zero External Leakage
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-slate-950/95 border-r border-slate-800/80 min-h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile} 
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        />
      )}

      {/* Mobile Drawer */}
      <div className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-slate-950 border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {sidebarContent}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 border-t border-slate-800/80 px-2 py-2 flex items-center justify-around backdrop-blur-md">
        <button
          onClick={() => navigateTo('workbench')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium ${
            activePage === 'workbench' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <MessageSquareCode className="w-4 h-4" />
          <span>Workbench</span>
        </button>

        <button
          onClick={() => navigateTo('documents')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium ${
            activePage === 'documents' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Documents</span>
        </button>

        <button
          onClick={() => navigateTo('approvals')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium relative ${
            activePage === 'approvals' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Approvals</span>
          {pendingApprovalsCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-amber-400"></span>
          )}
        </button>

        <button
          onClick={() => navigateTo(currentUser?.role === 'Administrator' ? 'dashboard' : 'policies')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium ${
            activePage === 'dashboard' || activePage === 'policies' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Control</span>
        </button>
      </nav>
    </>
  );
};
