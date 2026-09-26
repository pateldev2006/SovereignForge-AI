import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { ShieldCheck, Check } from 'lucide-react';

export const RolePermissionMatrix: React.FC = () => {
  const { rolePermissions, togglePermission } = useApp();

  const roles: { role: UserRole; title: string; label: string }[] = [
    { role: 'PlantEngineer', title: 'Plant / Process Engineer', label: 'Engineer' },
    { role: 'ITEngineer', title: 'IT / Automation Engineer', label: 'IT / SCADA' },
    { role: 'QAOfficer', title: 'Design / QA Officer', label: 'QA / Design' },
    { role: 'Approver', title: 'Approving Authority', label: 'Approver' },
    { role: 'CISO', title: 'CISO / Security Admin', label: 'CISO (Admin)' }
  ];

  const actions: ('view' | 'create' | 'edit' | 'delete' | 'approve' | 'export')[] = [
    'view', 'create', 'edit', 'delete', 'approve', 'export'
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              RBAC GOVERNANCE & ACCESS MATRIX
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Least-Privilege Enforcement
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Role & Capability Permission Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure module-level and action-level capabilities for each refinery role. Unauthorized components are hidden automatically from client interfaces.
          </p>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2 text-xs text-blue-900">
          <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>Interactive Prototype: Click matrix checkboxes to adjust role access permissions live.</span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4 min-w-[200px]">Module / Resource</th>
                <th className="p-4 min-w-[80px]">Action</th>
                {roles.map(r => (
                  <th key={r.role} className="p-4 text-center">
                    <span className="block font-bold text-slate-900">{r.label}</span>
                    <span className="text-[9px] font-mono text-slate-400 font-normal">{r.role}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {rolePermissions.map((row) => (
                <React.Fragment key={row.moduleKey}>
                  <tr className="bg-slate-50/60 font-semibold text-slate-900">
                    <td colSpan={2 + roles.length} className="px-4 py-2 text-xs font-bold text-blue-900 bg-blue-50/40 border-t border-slate-200">
                      {row.module} <span className="text-[10px] font-mono font-normal text-slate-400">({row.category})</span>
                    </td>
                  </tr>
                  {actions.map((act) => (
                    <tr key={act} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 pl-6 text-slate-600 font-medium">
                        {row.module}
                      </td>
                      <td className="p-3">
                        <span className="font-mono text-[10px] uppercase font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {act}
                        </span>
                      </td>
                      {roles.map(r => {
                        const isGranted = row.permissions[r.role]?.[act];
                        return (
                          <td key={r.role} className="p-3 text-center">
                            <button
                              onClick={() => togglePermission(r.role, row.moduleKey, act)}
                              className={`w-6 h-6 rounded-md border flex items-center justify-center mx-auto transition-all ${
                                isGranted 
                                  ? 'bg-blue-600 border-blue-600 text-white shadow-2xs hover:bg-blue-700' 
                                  : 'bg-white border-slate-300 text-slate-300 hover:border-slate-400'
                              }`}
                              title={`Toggle ${act} permission for ${r.label}`}
                            >
                              {isGranted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
