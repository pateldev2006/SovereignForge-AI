import React from 'react';
import { Cpu, Activity, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const SensorData: React.FC = () => {
  const telemetryData = [
    { time: '18:00', temp: 64, vibration: 1.2 },
    { time: '18:10', temp: 68, vibration: 1.8 },
    { time: '18:20', temp: 74, vibration: 2.9 },
    { time: '18:30', temp: 81, vibration: 4.1 },
    { time: '18:40', temp: 82.4, vibration: 4.6 },
    { time: '18:50', temp: 82.1, vibration: 4.5 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-400 mb-1">
            <Cpu className="w-4 h-4" /> OPC-UA Industrial Telemetry
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Pump P204 Sensor Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time bearing temperature & vibration spectrum analysis from air-gapped PLC node.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
            ELEVATED TEMP WARNING
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase">Drive-End Temperature</span>
          <div className="text-3xl font-bold text-amber-400 font-mono mt-1">82.4°C</div>
          <span className="text-[10px] text-amber-400 font-mono mt-1 block">Baseline Target: &lt; 65.0°C</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase">Vibration Amplitude (1X RPM)</span>
          <div className="text-3xl font-bold text-cyan-400 font-mono mt-1">4.6 mm/s</div>
          <span className="text-[10px] text-cyan-400 font-mono mt-1 block">RMS Velocity Standard ISO 10816</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase">Suction Pressure</span>
          <div className="text-3xl font-bold text-emerald-400 font-mono mt-1">42.1 PSI</div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">Normal Operating Range</span>
        </div>
      </div>

      {/* Graph */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white text-base font-mono flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" /> Temperature (°C) Real-Time Telemetry Trend
          </h3>
          <span className="text-xs font-mono text-slate-500">Live 10-Min Intervals</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={telemetryData}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
