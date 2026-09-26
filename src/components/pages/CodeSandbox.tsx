import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Terminal, Play, ShieldCheck, CheckCircle2, RefreshCw, Copy, Check, Lock, Cpu } from 'lucide-react';

export const CodeSandbox: React.FC = () => {
  const { showToast } = useApp();
  const [isRunning, setIsRunning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);

  const samplePythonCode = `# ==============================================================================
# SOVEREIGNFORGE AI - AIR-GAPPED SCADA MODBUS POLLER
# Target: Enterprise CDU-03 Heat Exchanger HX-204 Temperature Transmitters (TT-104A/B)
# Protocol: Modbus TCP (Isolated OT Subnet 10.14.20.10)
# ==============================================================================

import time
import json
import hashlib

def poll_transmitter_registers(unit_id=3, host="10.14.20.10", port=502):
    print(f"[*] Initializing air-gapped Modbus TCP session -> {host}:{port}")
    # Simulating register polling for HX-204 Shell & Tube inlet/outlet
    telemetry = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "equipment_id": "HX-204",
        "tt_104a_crude_inlet_deg_c": 182.4,
        "tt_104b_crude_outlet_deg_c": 248.6,
        "shell_delta_p_bar": 1.42,
        "status": "NORMAL_OPERATION"
    }
    
    # Generate cryptographic payload signature for local PostgreSQL
    raw_payload = json.dumps(telemetry, sort_keys=True).encode('utf-8')
    sig = hashlib.sha256(raw_payload).hexdigest()
    telemetry["local_sig"] = sig
    
    return telemetry

if __name__ == "__main__":
    result = poll_transmitter_registers()
    print("[+] Polling Success: Zero external sockets opened.")
    print(json.dumps(result, indent=2))
`;

  const handleRunCode = () => {
    setIsRunning(true);
    showToast('Executing Sandboxed Python Code', 'Spawning air-gapped container with blocked network egress...', 'info');

    setTimeout(() => {
      setIsRunning(false);
      setExecutionOutput(`[*] Initializing air-gapped Modbus TCP session -> 10.14.20.10:502
[+] Hardware Isolation: Verified eth1 internal bridge only.
[+] Polling Success: Zero external sockets opened.
{
  "equipment_id": "HX-204",
  "local_sig": "9f8e7d6c5b4a3928170e9f8e7d6c5b4a3928170e9f8e7d6c5b4a3928170e9f8e",
  "shell_delta_p_bar": 1.42,
  "status": "NORMAL_OPERATION",
  "timestamp": "2026-09-26 12:15:00",
  "tt_104a_crude_inlet_deg_c": 182.4,
  "tt_104b_crude_outlet_deg_c": 248.6
}
[✓] Process Exited: Code 0 (Sandbox Terminated Cleanly).`);
      showToast('Execution Completed', 'Sandboxed script executed safely in 180ms with 0 egress calls.', 'success');
    }, 900);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(samplePythonCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              IT & AUTOMATION CODE SANDBOX
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Qwen-Coder-32B Local Runtime
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            SCADA Automation & Python Sandbox
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Test and verify local Modbus polling scripts, SQL extractors, and telemetry parsers in an isolated, air-gapped execution container.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-all"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? 'Copied' : 'Copy Script'}</span>
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
          >
            {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isRunning ? 'Running in Sandbox...' : 'Run in Sandbox'}</span>
          </button>
        </div>
      </div>

      {/* Code Editor & Console Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Editor Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-card overflow-hidden flex flex-col">
          <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              modbus_poller_hx204.py
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              SANDBOX ISOLATED
            </span>
          </div>

          <div className="p-4 flex-1 overflow-x-auto">
            <pre className="font-mono text-xs text-blue-200 leading-relaxed">
              <code>{samplePythonCode}</code>
            </pre>
          </div>
        </div>

        {/* Execution Terminal Output Card */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-card overflow-hidden flex flex-col">
          <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Local Sandbox Output (Docker Container /dev/null egress)
            </span>
            <span className="text-[10px] text-slate-500">Exit Status: 0</span>
          </div>

          <div className="p-4 flex-1 font-mono text-xs text-emerald-400 leading-relaxed overflow-y-auto min-h-[360px] bg-black/40">
            {executionOutput ? (
              <pre>{executionOutput}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center py-16 space-y-2">
                <Terminal className="w-8 h-8 opacity-40" />
                <span>Click "Run in Sandbox" to execute script safely in local air-gapped node.</span>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
