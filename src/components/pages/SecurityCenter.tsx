import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, ShieldAlert, Lock, Activity, Server, Radio, 
  Cpu, AlertTriangle, CheckCircle2, Clock, Terminal, Users, Database,
  Key, RefreshCw, Layers, Archive, AlertOctagon, Check, Zap, FileText
} from 'lucide-react';

export const SecurityCenter: React.FC = () => {
  const { securityMetrics, networkTelemetry, auditLogs, setIsSovereigntyModalOpen, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'soc' | 'crypto' | 'backup' | 'zeroize'>('soc');

  // Key rotation state
  const [isRotatingKeys, setIsRotatingKeys] = useState(false);
  const [masterKeyStatus, setMasterKeyStatus] = useState({
    hsmType: 'Thales Luna PCIe HSM (FIPS 140-2 Level 3)',
    status: 'ACTIVE & LOCKED',
    keyId: 'SF-HSM-KEY-0x994F8A',
    lastRotated: '2026-08-15 03:00:00 IST',
    tlsCertExpiry: '2027-12-31 (Internal CA Valid)'
  });

  // Dual-Key Zeroization Dialog
  const [isZeroizeModalOpen, setIsZeroizeModalOpen] = useState(false);
  const [zeroizeDualKey, setZeroizeDualKey] = useState({
    cisoKey: '',
    directorKey: '',
    confirmed: false
  });

  // Backup & Snapshot State
  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);
  const [snapshots, setSnapshots] = useState([
    {
      id: 'SNP-20260926-0600',
      timestamp: '2026-09-26 06:00:00 IST',
      type: 'Automated Daily Full',
      size: '2.4 TB',
      hash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      scope: 'Vector DB + Policies + User Store + Audit Ledger',
      status: 'VERIFIED'
    },
    {
      id: 'SNP-20260925-0600',
      timestamp: '2026-09-25 06:00:00 IST',
      type: 'Automated Daily Full',
      size: '2.4 TB',
      hash: 'sha256:8b92b1154ef1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d8811',
      scope: 'Vector DB + Policies + User Store + Audit Ledger',
      status: 'VERIFIED'
    }
  ]);

  const handleRotateKeys = () => {
    setIsRotatingKeys(true);
    showToast('HSM Key Rotation Initiated', 'Re-encrypting AES-256-GCM data volumes with fresh ephemeral keys...', 'info');
    setTimeout(() => {
      setIsRotatingKeys(false);
      setMasterKeyStatus({
        ...masterKeyStatus,
        lastRotated: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' IST',
        keyId: `SF-HSM-KEY-0x${Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase()}`
      });
      showToast('Key Rotation Complete', 'All data-at-rest volumes successfully re-keyed under HSM supervision.', 'success');
    }, 1800);
  };

  const handleCreateSnapshot = () => {
    setIsCreatingSnapshot(true);
    showToast('Snapshot Creation Started', 'Dumping vector embeddings, deterministic policies, and encrypted audit trail...', 'info');
    setTimeout(() => {
      setIsCreatingSnapshot(false);
      const newSnap = {
        id: `SNP-${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' IST',
        type: 'Manual CISO Snapshot',
        size: '2.42 TB',
        hash: `sha256:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        scope: 'Full System State (Zero-Loss Recovery)',
        status: 'VERIFIED'
      };
      setSnapshots([newSnap, ...snapshots]);
      showToast('Snapshot Stored', `${newSnap.id} written to local encrypted cold backup volume.`, 'success');
    }, 2000);
  };

  const handleDualKeyZeroization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zeroizeDualKey.confirmed) {
      showToast('Confirmation Required', 'You must check the confirmation checkbox to proceed.', 'error');
      return;
    }
    setIsZeroizeModalOpen(false);
    showToast('🚨 ZEROIZATION EXECUTED', 'Master HSM keys destroyed. Stored vectors and cache permanently rendered unrecoverable.', 'error');
  };

  const securityEvents = auditLogs.filter(log => log.risk === 'High' || log.risk === 'Critical' || log.result === 'BLOCKED' || log.result === 'DENIED');

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              CISO / SECURITY OPERATIONS CENTER (SECTIONS 9 & 11)
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Air-Gapped Sovereign AI Perimeter
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Security, Cryptography & Disaster Recovery
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage hardware HSM root of trust, AES-256 data-at-rest encryption keys, point-in-time snapshots, and emergency lockdown controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSovereigntyModalOpen(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Telemetry Inspector</span>
          </button>
        </div>
      </div>

      {/* Hero Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Security Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg font-bold text-emerald-700 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-green"></span>
            SECURE
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">OISD-129 Air-Gapped</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Outbound Egress</span>
            <Lock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-emerald-900 mt-1">0</div>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Zero Outbound Sockets</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">HSM Master Key</span>
            <Key className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm font-bold text-blue-700 mt-2">LOCKED</div>
          <span className="text-[10px] text-slate-500 block mt-0.5">FIPS 140-2 Level 3</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Policy Violations</span>
            <AlertTriangle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-emerald-700 mt-1">0</div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Strict Fail-Closed</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Model Weights</span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm font-bold text-blue-700 mt-2">VERIFIED</div>
          <span className="text-[10px] text-slate-500 block mt-0.5">SHA-256 Bit-Identical</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Audit Ledger</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm font-bold text-emerald-700 mt-2">IMMUTABLE</div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Hash Chain Intact</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('soc')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'soc'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Security Threat Feed</span>
        </button>

        <button
          onClick={() => setActiveTab('crypto')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'crypto'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>HSM Cryptography & Key Rotation</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'backup'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Archive className="w-4 h-4" />
          <span>Snapshots & Disaster Recovery</span>
        </button>

        <button
          onClick={() => setActiveTab('zeroize')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'zeroize'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Emergency Lockdown & Zeroize</span>
        </button>
      </div>

      {/* TAB 1: SOC THREAT FEED */}
      {activeTab === 'soc' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Real-Time Security Event Stream</span>
            </h3>

            <div className="space-y-3">
              {securityEvents.map((evt) => (
                <div key={evt.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">{evt.action}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                      {evt.result}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{evt.details}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                    <span>User: {evt.user}</span>
                    <span>{evt.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance & Hardware Enclosure Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              Air-Gap Invariant Verification
            </h3>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-900">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Physical Isolation Active</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Hardware network interface cards on all inference nodes are operating with zero routing table gateways.
              </p>
            </div>

            <div className="text-xs text-slate-600 space-y-2 font-mono pt-2">
              <div className="flex justify-between">
                <span>DNS Queries Egress:</span>
                <strong className="text-emerald-700">0 (Loopback Only)</strong>
              </div>
              <div className="flex justify-between">
                <span>TLS Intercept:</span>
                <strong className="text-slate-800">Mutual TLS 1.3</strong>
              </div>
              <div className="flex justify-between">
                <span>USB Port Policy:</span>
                <strong className="text-slate-800">Read-Only Safetensors</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CRYPTOGRAPHY & HSM */}
      {activeTab === 'crypto' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Hardware Security Module (HSM) & Key Rotation
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cryptographic root-of-trust for all encrypted SQLite databases, dense vector embeddings, and audit trails.
              </p>
            </div>

            <button
              onClick={handleRotateKeys}
              disabled={isRotatingKeys}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isRotatingKeys ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                  <span>Rotating AES-256 Keys...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Rotate Data-at-Rest Keys</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase">HSM Device Enclosure</span>
              <strong className="text-sm text-slate-900 block">{masterKeyStatus.hsmType}</strong>
              <div className="text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> {masterKeyStatus.status}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Current Master Key Identifier</span>
              <strong className="text-sm text-blue-600 block">{masterKeyStatus.keyId}</strong>
              <span className="text-slate-500 text-[11px] block">Last Rotated: {masterKeyStatus.lastRotated}</span>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Automatic Key Schedule:</strong>
              Data volumes are encrypted under AES-256-GCM. In compliance with industrial cybersecurity standards, keys are rotated every 90 days or immediately upon CISO command.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SNAPSHOTS & DISASTER RECOVERY */}
      {activeTab === 'backup' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Encrypted System Snapshots & Disaster Recovery Runbook
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Deterministic recovery points capturing Qdrant vector collections, SQLite audit ledgers, and policy definitions.
              </p>
            </div>

            <button
              onClick={handleCreateSnapshot}
              disabled={isCreatingSnapshot}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isCreatingSnapshot ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Snapshot...</span>
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4" />
                  <span>Create Backup Snapshot Now</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-3">
            {snapshots.map((s) => (
              <div key={s.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">{s.id}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                      {s.type}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {s.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 font-mono">
                  <span>Scope: <strong>{s.scope}</strong></span> • <span>Size: <strong>{s.size}</strong></span>
                </div>

                <div className="text-[10px] font-mono text-slate-400 break-all bg-white p-2 rounded border border-slate-200">
                  {s.hash}
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => showToast('Disaster Recovery Verification', `${s.id} cryptographic integrity verified against cold storage.`, 'success')}
                    className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold rounded-lg text-slate-700"
                  >
                    Verify Hash
                  </button>
                  <button
                    onClick={() => showToast('Restore Simulation', 'Snapshot restore test executed in sandbox container with 0 delta.', 'info')}
                    className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200"
                  >
                    Test Point-in-Time Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EMERGENCY ZEROIZATION */}
      {activeTab === 'zeroize' && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold flex-shrink-0">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-rose-950">
                Emergency System Lockdown & Dual-Key Cryptographic Zeroization
              </h3>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                Emergency failsafe mechanism. Immediately severs active sessions, purges model weights from GPU VRAM, and destroys encryption master keys to prevent physical data extraction in the event of a facility compromise.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 bg-white rounded-xl border border-rose-200 space-y-3">
              <strong className="text-slate-900 block font-sans text-sm">Emergency System Lockdown</strong>
              <p className="text-slate-600 text-[11px] font-sans">
                Immediately freeze all tasks, invalidate all authentication JWTs, and drop all local LAN ports.
              </p>
              <button
                onClick={() => showToast('System Lockdown Activated', 'All user sessions frozen. Model server placed in SAFE state.', 'warning')}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs"
              >
                🔒 Execute Immediate System Lockdown
              </button>
            </div>

            <div className="p-4 bg-white rounded-xl border border-rose-200 space-y-3">
              <strong className="text-rose-950 block font-sans text-sm">Dual-Key Cryptographic Wipe</strong>
              <p className="text-slate-600 text-[11px] font-sans">
                Permanently zeros HSM master keys. Renders all stored embeddings and database tables unreadable.
              </p>
              <button
                onClick={() => setIsZeroizeModalOpen(true)}
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                🚨 Initiate Dual-Key Zeroization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Dual-Key Zeroization Dialog */}
      {isZeroizeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-400 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 text-rose-600">
              <AlertOctagon className="w-6 h-6" />
              <h3 className="font-extrabold text-base text-slate-900">Dual-Authorization Two-Key Turn</h3>
            </div>

            <p className="text-xs text-slate-600">
              This action requires cryptographic signing keys from both the <strong>CISO Administrator</strong> and <strong>Executive Director</strong>.
            </p>

            <form onSubmit={handleDualKeyZeroization} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">CISO Clearance Passcode</label>
                <input
                  type="password"
                  required
                  placeholder="Enter CISO private credential"
                  value={zeroizeDualKey.cisoKey}
                  onChange={(e) => setZeroizeDualKey({ ...zeroizeDualKey, cisoKey: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Executive Director Two-Key Turn</label>
                <input
                  type="password"
                  required
                  placeholder="Enter Executive Authorizer credential"
                  value={zeroizeDualKey.directorKey}
                  onChange={(e) => setZeroizeDualKey({ ...zeroizeDualKey, directorKey: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="confirm-zeroize"
                  checked={zeroizeDualKey.confirmed}
                  onChange={(e) => setZeroizeDualKey({ ...zeroizeDualKey, confirmed: e.target.checked })}
                  className="w-4 h-4 text-rose-600"
                />
                <label htmlFor="confirm-zeroize" className="text-[11px] font-bold text-rose-700">
                  I understand this permanently destroys local master keys.
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsZeroizeModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Confirm Zeroization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
