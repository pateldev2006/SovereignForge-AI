import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MessageSquareCode, Send, Sparkles, FileText, CheckCircle2, 
  AlertTriangle, HelpCircle, ShieldCheck, ShieldAlert, Cpu, Lock, RefreshCw, ArrowRight
} from 'lucide-react';

export const AIWorkbench: React.FC = () => {
  const { chatMessages, sendChatMessage, currentUser, navigateTo } = useApp();
  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const quickPrompts = [
    "What is the maintenance procedure for Pump P204?",
    "Summarize the latest inspection report.",
    "Is this equipment safe to operate?",
    "Show previous issues with this machine."
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    sendChatMessage(inputQuery);
    setInputQuery('');
  };

  const handleQuickPromptClick = (promptText: string) => {
    sendChatMessage(promptText);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col max-w-6xl mx-auto p-2 sm:p-4 lg:p-6">
      
      {/* Top Bar Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-4 flex items-center justify-between shadow-lg backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center glow-cyan">
            <MessageSquareCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-white text-base font-mono leading-none">
                AI WORKBENCH — REASONING ENGINE
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                AIR-GAPPED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Confidential Retrieval-Augmented Generation (RAG) • Sovereign Industrial LLM v2.1
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>RBAC: <strong className="text-white">{currentUser?.role}</strong></span>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2 mb-4 scrollbar-thin">
        {chatMessages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
          >
            <div className={`max-w-3xl w-full rounded-2xl p-4 sm:p-5 border shadow-xl ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-cyan-500/40 text-white self-end ml-12'
                : msg.isDenied
                ? 'bg-rose-950/40 border-rose-500/40 text-slate-200 glow-red'
                : 'bg-slate-900/90 border-slate-800 text-slate-100'
            }`}>
              
              {/* Sender Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  {msg.sender === 'user' ? (
                    <>
                      <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-mono font-bold">
                        {currentUser?.name.charAt(0) || 'U'}
                      </div>
                      <span className="text-xs font-bold text-cyan-300">{currentUser?.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({currentUser?.role})</span>
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-white font-mono">SovereignForge AI</span>
                      {msg.isDenied ? (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-mono font-bold border border-rose-500/30">
                          ACCESS RESTRICTED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 text-[10px] font-mono font-bold">
                          LLM v2.1
                        </span>
                      )}
                    </>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
              </div>

              {/* Message Content */}
              <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed mb-3">
                {msg.text}
              </div>

              {/* AI Metadata & Evidence Cards */}
              {msg.sender === 'ai' && !msg.isDenied && (
                <div className="mt-4 pt-3 border-t border-slate-800/90 space-y-3">
                  
                  {/* Verification Status & Confidence Score */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Verification:</span>
                      {msg.verificationStatus === 'Verified' && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Evidence
                        </span>
                      )}
                      {msg.verificationStatus === 'Needs Review' && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Needs Review
                        </span>
                      )}
                      {msg.verificationStatus === 'Insufficient Evidence' && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-xs font-mono font-bold border border-rose-500/30">
                          <HelpCircle className="w-3.5 h-3.5 text-rose-400" /> Insufficient Evidence
                        </span>
                      )}
                    </div>

                    {msg.confidence !== undefined && (
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-slate-400">Confidence Score:</span>
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                          {msg.confidence}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Evidence Citation Cards */}
                  {msg.evidence && msg.evidence.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-cyan-400" /> Source Evidence Citations ({msg.evidence.length})
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.evidence.map((item, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                            <div>
                              <div className="font-semibold text-white text-xs">{item.title}</div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                Page {item.page} • {item.section}
                              </div>
                            </div>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-800 text-cyan-300">
                              {item.classification}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Action Button */}
                  {msg.text.includes('Pump P204') && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => navigateTo('image-analysis')}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold border border-cyan-500/40 transition-all flex items-center gap-1.5"
                      >
                        Run Visual Inspection Analysis <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none shrink-0">
        <span className="text-[10px] font-mono uppercase text-slate-500 font-bold shrink-0">Suggested:</span>
        {quickPrompts.map((promptText, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickPromptClick(promptText)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs whitespace-nowrap transition-all"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Input Chat Box */}
      <form onSubmit={handleSend} className="relative shrink-0">
        <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-2xl focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all">
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder="Ask a technical or maintenance question about confidential assets..."
            className="w-full bg-transparent px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 disabled:hover:from-cyan-600 text-white transition-all shadow-md shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

    </div>
  );
};
