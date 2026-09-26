import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckSquare, Bot, Clock, CheckCircle2, AlertTriangle, ArrowRight, Play } from 'lucide-react';

export const Tasks: React.FC = () => {
  const { tasks, navigateTo } = useApp();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              INDUSTRIAL TASK QUEUE
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Autonomous Workflows
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            My Active Industrial Tasks
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track multi-step engineering tasks, OCR extractions, SOP cross-references, and pending approval notes.
          </p>
        </div>

        <button
          onClick={() => navigateTo('workbench')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
        >
          <Bot className="w-4 h-4" />
          <span>New AI Agent Task</span>
        </button>
      </div>

      {/* Task Cards */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:border-blue-300 transition-all flex flex-col justify-between space-y-4 cursor-pointer"
            onClick={() => navigateTo('workbench')}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold flex-shrink-0">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {task.taskNumber}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Created: {task.createdAt}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1 leading-snug">{task.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-3xl">{task.description}</p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                task.status === 'Awaiting Approval' 
                  ? 'bg-amber-50 text-amber-800 border-amber-200' 
                  : task.status === 'Approved' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}>
                {task.status}
              </span>
            </div>

            {/* Model & Routing Details */}
            <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <span>Model: <strong className="text-slate-800 font-mono">{task.modelRoute.selectedModel}</strong></span>
                <span>•</span>
                <span>Duration: <strong className="text-slate-800 font-mono">{task.totalDurationSec}s</strong></span>
                <span>•</span>
                <span>Attached: <strong className="text-slate-800">{task.attachedFiles.length} files</strong></span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo('workbench');
                }}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
              >
                <span>View Full Agent Trace & Deliverable</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
