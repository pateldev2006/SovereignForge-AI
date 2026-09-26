import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, Lock, AlertTriangle, Check, X, FileCheck2, Cpu, 
  Layers, Plus, Play, History, ArrowRight, Sparkles, Sliders, CheckCircle2
} from 'lucide-react';

interface PolicyRule {
  id: string;
  code: string;
  title: string;
  condition: string;
  action: string;
  category: 'Operational Safety' | 'Perimeter Defense' | 'Model Governance' | 'Compliance & PII';
  status: 'Enforced' | 'Simulation Only' | 'Disabled';
  version: string;
  failMode: 'FAIL_CLOSED' | 'FAIL_OPEN';
  isLocked: boolean;
}

export const Policies: React.FC = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'rules' | 'builder' | 'simulation'>('rules');

  const [policies, setPolicies] = useState<PolicyRule[]>([
    {
      id: 'pol-01',
      code: 'SEC-POL-01',
      title: 'Zero Outbound Network Egress (Air-Gap Mandate)',
      condition: 'IF packet.direction == OUTBOUND AND packet.dst NOT IN [10.0.0.0/8, 127.0.0.1]',
      action: 'HARD_DROP_PACKET & RAISE_CISO_ALERT',
      category: 'Perimeter Defense',
      status: 'Enforced',
      version: 'v3.1.0',
      failMode: 'FAIL_CLOSED',
      isLocked: true
    },
    {
      id: 'pol-02',
      code: 'SAF-POL-02',
      title: 'All P&ID & Interlock Modifications Require L4 Sign-off',
      condition: 'IF task.type == "PID_REVIEW" AND task.contains_safety_interlock == TRUE',
      action: 'REQUIRE_HUMAN_SIGN_OFF (L4 Approver Clearance)',
      category: 'Operational Safety',
      status: 'Enforced',
      version: 'v2.4.1',
      failMode: 'FAIL_CLOSED',
      isLocked: false
    },
    {
      id: 'pol-03',
      code: 'FIN-POL-03',
      title: 'No Ungrounded Financial / Cost Calculations',
      condition: 'IF task.category == "Cost Estimation" AND source_grounding < 0.90',
      action: 'BLOCK_DELIVERABLE & REQUEST_SOURCE_SHEET',
      category: 'Compliance & PII',
      status: 'Enforced',
      version: 'v1.8.0',
      failMode: 'FAIL_CLOSED',
      isLocked: false
    },
    {
      id: 'pol-04',
      code: 'MOD-POL-04',
      title: 'Local Model Weight Cryptographic Integrity Verification',
      condition: 'IF model.sha256 != hardware_tpm_hash',
      action: 'PREVENT_VRAM_ALLOCATION & PURGE_NVME',
      category: 'Model Governance',
      status: 'Enforced',
      version: 'v2.0.0',
      failMode: 'FAIL_CLOSED',
      isLocked: true
    },
    {
      id: 'pol-05',
      code: 'COD-POL-05',
      title: 'Code Execution Strict Isolation (Python 3.11 Sandboxing)',
      condition: 'IF code_runner.sys_call IN ["socket", "fork", "ptrace", "execve"]',
      action: 'TERMINATE_SANDBOX & RECORD_AUDIT_BREACH',
      category: 'Operational Safety',
      status: 'Enforced',
      version: 'v1.2.4',
      failMode: 'FAIL_CLOSED',
      isLocked: false
    }
  ]);

  // Policy Builder State
  const [builderForm, setBuilderForm] = useState({
    code: 'NEW-POL-06',
    title: '',
    category: 'Operational Safety' as const,
    taskType: 'Engineering Calculation',
    conditionField: 'confidence_score',
    operator: '<',
    threshold: '0.85',
    actionType: 'REQUIRE_HUMAN_APPROVAL',
    failMode: 'FAIL_CLOSED' as const
  });

  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStats, setSimulationStats] = useState<{
    testedTasks: number;
    flagged: number;
    blocked: number;
    passed: number;
    simulatedRule: string;
  } | null>(null);

  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    const newPol: PolicyRule = {
      id: `pol-${Date.now()}`,
      code: builderForm.code,
      title: builderForm.title || 'Custom Industrial Rule',
      condition: `IF task.${builderForm.conditionField} ${builderForm.operator} ${builderForm.threshold}`,
      action: builderForm.actionType,
      category: builderForm.category,
      status: 'Enforced',
      version: 'v1.0.0',
      failMode: builderForm.failMode,
      isLocked: false
    };

    setPolicies([...policies, newPol]);
    setActiveTab('rules');
    showToast('Policy Created', `${newPol.code}: ${newPol.title} active across SovereignForge runtime.`, 'success');
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    showToast('Policy Simulation Started', 'Evaluating proposed rule against past 124 completed plant tasks...', 'info');
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationStats({
        testedTasks: 124,
        flagged: 18,
        blocked: 2,
        passed: 104,
        simulatedRule: `IF source_grounding < 0.90 THEN REQUIRE_HUMAN_APPROVAL`
      });
      showToast('Simulation Finished', 'Historical backtest complete: 18 tasks flagged for review, 0 false blocks.', 'success');
    }, 1500);
  };

  const togglePolicy = (id: string) => {
    setPolicies(policies.map(p => {
      if (p.id === id) {
        if (p.isLocked) {
          showToast('Policy Immutable', 'Mandatory security baseline policy cannot be altered.', 'warning');
          return p;
        }
        const next = p.status === 'Enforced' ? 'Disabled' : 'Enforced';
        showToast('Policy State Changed', `${p.code} set to ${next}.`, 'info');
        return { ...p, status: next };
      }
      return p;
    }));
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              DETERMINISTIC POLICY ENGINE (SECTION 5)
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Statutory Industrial Governance
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Policy & Rule Governance Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Define deterministic condition-to-action guardrails, simulate policy impact on historical tasks, and maintain immutable version control.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('builder')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Policy Rule</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'rules'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Active Policy Rules ({policies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('builder')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'builder'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Visual Rule Builder (IF ➔ THEN)</span>
        </button>

        <button
          onClick={() => setActiveTab('simulation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulation'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Policy Impact Simulator (What-If Backtest)</span>
        </button>
      </div>

      {/* TAB 1: ACTIVE POLICY RULES */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map((pol) => (
            <div key={pol.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:border-indigo-200 transition-all space-y-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {pol.code}
                    </span>
                    <span className="ml-2 text-[10px] font-mono text-slate-400">{pol.version}</span>
                    <h3 className="font-extrabold text-sm text-slate-900 mt-1 leading-snug">{pol.title}</h3>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border flex-shrink-0 ${
                    pol.status === 'Enforced' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {pol.status}
                  </span>
                </div>

                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-700 uppercase block">CONDITION</span>
                    <code className="text-slate-800 text-[11px] font-semibold">{pol.condition}</code>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block">ACTION TRIGGER</span>
                    <code className="text-slate-900 text-[11px] font-bold">{pol.action}</code>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase">
                  Mode: <strong className="text-slate-800">{pol.failMode}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast('Version History', `${pol.code} is at ${pol.version}. Previous snapshot available in audit ledger.`, 'info')}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 text-xs"
                    title="View Version Diff & Rollback"
                  >
                    <History className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => togglePolicy(pol.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      pol.status === 'Enforced'
                        ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {pol.status === 'Enforced' ? 'Disable' : 'Enforce'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: VISUAL RULE BUILDER */}
      {activeTab === 'builder' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card max-w-2xl mx-auto space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900">Deterministic Policy Rule Builder</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Construct high-assurance compliance conditions evaluated during prompt parsing and deliverable synthesis.
            </p>
          </div>

          <form onSubmit={handleCreatePolicy} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Policy Identifier Code</label>
                <input
                  type="text"
                  required
                  value={builderForm.code}
                  onChange={(e) => setBuilderForm({ ...builderForm, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Policy Category</label>
                <select
                  value={builderForm.category}
                  onChange={(e) => setBuilderForm({ ...builderForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                >
                  <option value="Operational Safety">Operational Safety</option>
                  <option value="Perimeter Defense">Perimeter Defense</option>
                  <option value="Model Governance">Model Governance</option>
                  <option value="Compliance & PII">Compliance & PII</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Policy Name / Description</label>
              <input
                type="text"
                required
                placeholder="e.g. Require L4 clearance on Hydrocarbon pump replacements"
                value={builderForm.title}
                onChange={(e) => setBuilderForm({ ...builderForm, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            {/* Visual IF -> THEN Builder */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3">
              <div className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>LOGICAL CONDITION (IF)</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <select
                  value={builderForm.conditionField}
                  onChange={(e) => setBuilderForm({ ...builderForm, conditionField: e.target.value })}
                  className="px-3 py-2 bg-white rounded-lg border border-indigo-200 font-mono text-xs"
                >
                  <option value="confidence_score">Grounding Score</option>
                  <option value="task_type">Task Type</option>
                  <option value="user_clearance">User Clearance</option>
                  <option value="contains_scada_tag">Contains SCADA Tag</option>
                </select>

                <select
                  value={builderForm.operator}
                  onChange={(e) => setBuilderForm({ ...builderForm, operator: e.target.value })}
                  className="px-3 py-2 bg-white rounded-lg border border-indigo-200 font-mono text-xs text-center font-bold"
                >
                  <option value="<">&lt; (Less Than)</option>
                  <option value=">">&gt; (Greater Than)</option>
                  <option value="==">== (Equals)</option>
                  <option value="!=">!= (Not Equal)</option>
                </select>

                <input
                  type="text"
                  value={builderForm.threshold}
                  onChange={(e) => setBuilderForm({ ...builderForm, threshold: e.target.value })}
                  className="px-3 py-2 bg-white rounded-lg border border-indigo-200 font-mono text-xs"
                />
              </div>

              <div className="pt-2 border-t border-indigo-200/80">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ACTION DISPATCH (THEN)</span>
                </div>

                <select
                  value={builderForm.actionType}
                  onChange={(e) => setBuilderForm({ ...builderForm, actionType: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-emerald-200 font-mono text-xs font-bold text-slate-800"
                >
                  <option value="REQUIRE_HUMAN_APPROVAL">REQUIRE_HUMAN_APPROVAL (Freeze for L4/L5)</option>
                  <option value="BLOCK_DELIVERABLE_OUTPUT">BLOCK_DELIVERABLE_OUTPUT (Immediate Redaction)</option>
                  <option value="RAISE_CISO_SECURITY_ALERT">RAISE_CISO_SECURITY_ALERT (Log Severity 1)</option>
                  <option value="FORCE_ADDITIONAL_CITATIONS">FORCE_ADDITIONAL_CITATIONS (Re-query RAG)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('rules')}
                className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs"
              >
                Save & Enforce Policy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: POLICY IMPACT SIMULATION */}
      {activeTab === 'simulation' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Historical Backtest & What-If Policy Simulation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Test a proposed rule against past plant engineering tasks to evaluate false positive rates and operational friction before deploying to live runtime.
                </p>
              </div>

              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    <span>Backtesting Historic Tasks...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Run Backtest on 124 Past Tasks</span>
                  </>
                )}
              </button>
            </div>

            {simulationStats && (
              <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in duration-200">
                <div className="font-mono text-xs text-slate-700 font-bold flex items-center justify-between">
                  <span>BACKTEST TARGET: {simulationStats.simulatedRule}</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">100% COMPLETE</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Total Tasks Tested</span>
                    <strong className="text-lg font-mono text-slate-900 block mt-0.5">{simulationStats.testedTasks}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-emerald-600 font-bold uppercase">Passed Cleanly</span>
                    <strong className="text-lg font-mono text-emerald-700 block mt-0.5">{simulationStats.passed}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-amber-600 font-bold uppercase">Flagged for Review</span>
                    <strong className="text-lg font-mono text-amber-700 block mt-0.5">{simulationStats.flagged}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-rose-600 font-bold uppercase">Strictly Blocked</span>
                    <strong className="text-lg font-mono text-rose-700 block mt-0.5">{simulationStats.blocked}</strong>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium">
                  <strong>Recommendation:</strong> Low operational friction detected (14.5% review rate, 0 critical workflow interruptions). Safe for live production deployment.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
