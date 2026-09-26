import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';
import { 
  Bot, FileText, BookOpen, CheckSquare, ClipboardCheck, Terminal, 
  History, ShieldAlert, Users, Sliders, Cpu, Network, 
  Database, Lock, ChevronRight
} from 'lucide-react';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
  moduleKey: string;
}

export const Sidebar: React.FC<{ isMobileOpen?: boolean; onCloseMobile?: () => void }> = ({ 
  isMobileOpen, 
  onCloseMobile 
}) => {
  const { activePage, navigateTo, canViewPage, currentUser, approvals, tasks } = useApp();

  // Pending counts for badges
  const pendingApprovalsCount = approvals.filter(a => a.status === 'Awaiting Review').length;
  const activeTasksCount = tasks.filter(t => t.status !== 'Approved' && t.status !== 'Rejected').length;

  // 1. User Workbench Items (filtered dynamically by canViewPage)
  const userWorkbenchItems: NavItem[] = [
    {
      id: 'workbench',
      label: 'AI Task Composer',
      icon: <Bot className="w-4 h-4" />,
      moduleKey: 'workbench'
    },
    {
      id: 'tasks',
      label: 'My Industrial Tasks',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: activeTasksCount,
      badgeColor: 'bg-blue-100 text-blue-700',
      moduleKey: 'workbench'
    },
    {
      id: 'documents',
      label: 'Document Repository',
      icon: <FileText className="w-4 h-4" />,
      moduleKey: 'documents'
    },
    {
      id: 'knowledge',
      label: 'SOP & Standards Base',
      icon: <BookOpen className="w-4 h-4" />,
      moduleKey: 'knowledge'
    },
    {
      id: 'approvals',
      label: 'Approval & Sign-Off',
      icon: <ClipboardCheck className="w-4 h-4" />,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 font-bold',
      moduleKey: 'approvals'
    },
    {
      id: 'reviews',
      label: 'P&ID & SOP Review',
      icon: <Sliders className="w-4 h-4" />,
      moduleKey: 'reviews'
    },
    {
      id: 'code-sandbox',
      label: 'Code Agent & Sandbox',
      icon: <Terminal className="w-4 h-4" />,
      moduleKey: 'code-sandbox'
    },
    {
      id: 'audit-history',
      label: 'My Audit History',
      icon: <History className="w-4 h-4" />,
      moduleKey: 'workbench'
    }
  ];

  // 2. Admin Control Center Items (Only rendered if user has admin permissions)
  const adminCenterItems: NavItem[] = [
    {
      id: 'admin-security',
      label: 'CISO Security Dashboard',
      icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
      moduleKey: 'admin-security'
    },
    {
      id: 'admin-roles',
      label: 'Roles & Permissions',
      icon: <Users className="w-4 h-4" />,
      moduleKey: 'admin-roles'
    },
    {
      id: 'admin-firewall',
      label: 'AI Capability Firewall',
      icon: <Lock className="w-4 h-4 text-blue-600" />,
      moduleKey: 'admin-firewall'
    },
    {
      id: 'admin-models',
      label: 'Local Model Registry',
      icon: <Cpu className="w-4 h-4" />,
      moduleKey: 'admin-models'
    },
    {
      id: 'admin-network',
      label: 'Network Sovereignty',
      icon: <Network className="w-4 h-4" />,
      moduleKey: 'admin-network'
    },
    {
      id: 'admin-audit',
      label: 'Global Forensic Audit',
      icon: <Database className="w-4 h-4" />,
      moduleKey: 'admin-audit'
    }
  ];

  // Filter items strictly based on role authorization
  const visibleWorkbenchItems = userWorkbenchItems.filter(item => canViewPage(item.id));
  const visibleAdminItems = adminCenterItems.filter(item => canViewPage(item.id));

  return (
    <aside className={`
      w-60 bg-white border-r border-slate-200/90 flex flex-col justify-between flex-shrink-0 z-20 select-none
      lg:static fixed inset-y-0 left-0 transition-transform duration-200
      ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      
      {/* Scrollable Navigation Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        
        {/* Section A: User Workbench */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            USER WORKBENCH
          </div>
          <div className="space-y-0.5">
            {visibleWorkbenchItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigateTo(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-xs font-bold' 
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-white' : 'text-slate-500'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section B: Admin Control Center */}
        {visibleAdminItems.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <div className="px-3 pb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                ADMIN CONTROL CENTER
              </span>
              <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100">
                CISO
              </span>
            </div>
            <div className="space-y-0.5">
              {visibleAdminItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigateTo(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all
                      ${isActive 
                        ? 'bg-blue-600 text-white shadow-xs font-bold' 
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}
                    `}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-white' : 'text-slate-500'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    <ChevronRight className={`w-3.5 h-3.5 opacity-40 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Air-Gap Hardware Security Widget */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50/70">
        <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-green"></span>
              <span className="text-[10px] font-bold text-slate-900">AIR-GAP ACTIVE</span>
            </div>
            <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              0 EGRESS
            </span>
          </div>
          <div className="mt-1.5 text-[9px] text-slate-500 space-y-0.5 font-mono">
            <div className="flex justify-between">
              <span>Egress Sockets:</span>
              <strong className="text-slate-800">BLOCKED</strong>
            </div>
            <div className="flex justify-between">
              <span>Model Weights:</span>
              <strong className="text-emerald-700">Verified Local</strong>
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
};
