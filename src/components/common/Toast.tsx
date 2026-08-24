import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, setToastMessage } = useApp();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, setToastMessage]);

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/40 bg-emerald-950/90 text-emerald-100',
    warning: 'border-amber-500/40 bg-amber-950/90 text-amber-100',
    error: 'border-rose-500/50 bg-rose-950/90 text-rose-100 glow-red',
    info: 'border-cyan-500/40 bg-slate-900/95 text-cyan-100'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-slide-up">
      <div className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl ${borders[toastMessage.type]}`}>
        {icons[toastMessage.type]}
        <div className="flex-1 text-sm">
          <h4 className="font-semibold text-base leading-tight mb-0.5">{toastMessage.title}</h4>
          <p className="opacity-90 text-xs leading-relaxed">{toastMessage.desc}</p>
        </div>
        <button 
          onClick={() => setToastMessage(null)} 
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
