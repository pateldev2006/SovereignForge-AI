import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  ShieldCheck, Check, UserPlus, Lock, Trash2, Key, 
  Users, Sparkles, Building2, UserCheck, AlertCircle, X, ShieldAlert
} from 'lucide-react';

export const RolePermissionMatrix: React.FC = () => {
  const { 
    currentUser, 
    rolePermissions, 
    togglePermission, 
    users, 
    addUser, 
    deleteUser, 
    switchUser,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'matrix'>('users');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New User Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: 'MRPL-ENG-' + Math.floor(10000 + Math.random() * 90000),
    role: 'PlantEngineer' as UserRole,
    roleTitle: 'Plant & Process Engineer',
    department: 'Process Engineering — CDU/VDU Unit 03',
    clearanceLevel: 'L1 - Process Operations' as const,
    location: 'MRPL Refinery Complex, Mangalore'
  });

  const roles: { role: UserRole; title: string; label: string; defaultClearance: string; defaultDept: string }[] = [
    { 
      role: 'PlantEngineer', 
      title: 'Plant / Process Engineer', 
      label: 'Engineer', 
      defaultClearance: 'L1 - Process Operations',
      defaultDept: 'Process Engineering — CDU/VDU Unit 03'
    },
    { 
      role: 'ITEngineer', 
      title: 'IT / Automation Engineer', 
      label: 'IT / SCADA', 
      defaultClearance: 'L2 - Engineering & SCADA',
      defaultDept: 'IT, OT & Automation Infrastructure'
    },
    { 
      role: 'QAOfficer', 
      title: 'Design / QA Officer', 
      label: 'QA / Design', 
      defaultClearance: 'L3 - Quality & Compliance',
      defaultDept: 'Quality Assurance & Technical Services'
    },
    { 
      role: 'Approver', 
      title: 'Approving Authority', 
      label: 'Approver', 
      defaultClearance: 'L4 - Executive Approval',
      defaultDept: 'Operations Directorate & Technical Services'
    },
    { 
      role: 'CISO', 
      title: 'CISO / Security Admin', 
      label: 'CISO (Admin)', 
      defaultClearance: 'L5 - CISO Security Clearance',
      defaultDept: 'Information Security & Air-Gap Governance Directorate'
    }
  ];

  const actions: ('view' | 'create' | 'edit' | 'delete' | 'approve' | 'export')[] = [
    'view', 'create', 'edit', 'delete', 'approve', 'export'
  ];

  const handleRoleSelect = (role: UserRole) => {
    const config = roles.find(r => r.role === role);
    if (config) {
      setFormData(prev => ({
        ...prev,
        role,
        roleTitle: config.title,
        department: config.defaultDept,
        clearanceLevel: config.defaultClearance as any
      }));
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Validation Error', 'Please provide a valid employee name and official email.', 'warning');
      return;
    }

    const res = addUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      roleTitle: formData.roleTitle,
      department: formData.department,
      employeeId: formData.employeeId.trim(),
      clearanceLevel: formData.clearanceLevel,
      activeSession: true,
      location: formData.location
    });

    if (res.success) {
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        email: '',
        employeeId: 'MRPL-ENG-' + Math.floor(10000 + Math.random() * 90000),
        role: 'PlantEngineer',
        roleTitle: 'Plant & Process Engineer',
        department: 'Process Engineering — CDU/VDU Unit 03',
        clearanceLevel: 'L1 - Process Operations',
        location: 'MRPL Refinery Complex, Mangalore'
      });
    }
  };

  const handleAttemptAdd = () => {
    if (currentUser.role !== 'CISO') {
      showToast(
        'Access Denied (Admin Only)',
        `Only CISO / Security Administrators can provision new employee accounts. Your current role is "${currentUser.roleTitle}". Switch to Suresh Bhat (CISO) in the header to test adding users.`,
        'error'
      );
      return;
    }
    setIsAddModalOpen(true);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150 font-sans">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              RBAC GOVERNANCE & ACCESS CONTROL
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Air-Gapped Sovereign Identity
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            User Directory & Permission Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer on-premise accounts, assign role clearances, and manage module-level least-privilege matrix rules.
          </p>
        </div>

        {/* Action Button: Provision User (Admin only) */}
        <div className="flex items-center gap-3">
          {currentUser.role === 'CISO' ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-102 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Provision New User (Admin)</span>
            </button>
          ) : (
            <button
              onClick={handleAttemptAdd}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              title="Only CISO (Security Administrator) can add users"
            >
              <Lock className="w-4 h-4 text-amber-600" />
              <span>+ Provision New User</span>
              <span className="text-[9px] bg-amber-100 text-amber-800 font-mono px-1.5 py-0.5 rounded uppercase font-extrabold">
                CISO Admin Only
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Role Permission Notice Banner */}
      {currentUser.role !== 'CISO' && (
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-bold text-amber-900">Least-Privilege Role Enforcement Active</h4>
            <p className="text-amber-800/90 leading-relaxed text-[11px]">
              You are currently authenticated as <strong>{currentUser.name}</strong> ({currentUser.roleTitle}). Provisioning new accounts or modifying permission matrices requires <strong>L5 CISO Security Clearance</strong>.
              To test adding users, switch your active role to <strong>Suresh Bhat (CISO)</strong> using the Role Switcher in the top right header.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Directory ({users.length} Provisioned Accounts)</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'matrix'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Role Capability Permission Matrix</span>
        </button>
      </div>

      {/* ═══ TAB 1: USER DIRECTORY & PROVISIONING ═══ */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((u) => {
              const isCurrent = currentUser.id === u.id;
              return (
                <div 
                  key={u.id}
                  className={`bg-white rounded-2xl border p-5 transition-all relative flex flex-col justify-between ${
                    isCurrent 
                      ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' 
                      : 'border-slate-200 shadow-card hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-black text-sm flex items-center justify-center shadow-xs">
                          {u.avatar || u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-900 leading-tight">{u.name}</h3>
                          <span className="text-[11px] text-blue-700 font-bold block">{u.roleTitle}</span>
                        </div>
                      </div>

                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-bold font-mono">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    {/* Metadata Details */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Employee ID:</span>
                        <span className="font-mono font-bold text-slate-800">{u.employeeId}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Department:</span>
                        <span className="font-medium text-slate-800 truncate max-w-[180px]" title={u.department}>{u.department}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Clearance:</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px] font-mono">
                          {u.clearanceLevel}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Official Email:</span>
                        <span className="font-mono text-[10px] text-slate-700">{u.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => switchUser(u.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {isCurrent ? 'Current Context' : 'Switch Context'}
                    </button>

                    {currentUser.role === 'CISO' && (
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Deactivate / Deprovision account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ TAB 2: ROLE CAPABILITY MATRIX ═══ */}
      {activeTab === 'matrix' && (
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
      )}

      {/* ═══ PROVISION NEW USER MODAL (ADMIN ONLY) ═══ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">Provision SovereignForge User Account</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Air-Gapped MRPL Active Directory Enrollment
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                    Employee Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vikramaditya Rao"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-semibold focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                    Employee ID / Badge No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    placeholder="MRPL-ENG-98214"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono font-semibold focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  Official MRPL Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="v.rao@mrpl.co.in"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  Assign System Role & Clearance Level *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleSelect(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  {roles.map((r) => (
                    <option key={r.role} value={r.role}>
                      {r.title} — ({r.defaultClearance})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-medium focus:bg-white focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                    Plant Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-medium focus:bg-white focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Air-Gap Cryptographic Enrollment
                </div>
                <p className="text-blue-800 leading-tight">
                  Upon submission, an RSA-2048 private key will be generated and signed by the MRPL Root Certificate Authority with zero outbound egress.
                </p>
              </div>

              {/* Modal Footer */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Key className="w-4 h-4" />
                  <span>Issue Credentials & Provision</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
