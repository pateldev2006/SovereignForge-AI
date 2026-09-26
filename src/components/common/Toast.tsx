import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, clearToast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
  };

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    error: 'bg-rose-50 border-rose-200 text-rose-950',
    warning: 'bg-amber-50 border-amber-200 text-amber-950',
    info: 'bg-blue-50 border-blue-200 text-blue-950'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className={`p-4 rounded-xl border shadow-lg flex items-start gap-3 ${bgStyles[toast.type]}`}>
        {icons[toast.type]}
        <div className="flex-1 min-w-0 pr-2">
          <h4 className="text-xs font-bold uppercase tracking-wider opacity-90">{toast.title}</h4>
          <p className="text-sm mt-0.5 leading-relaxed opacity-85 font-medium">{toast.desc}</p>
        </div>
        <button
          onClick={clearToast}
          className="p-1 rounded-lg hover:bg-black/5 text-gray-500 hover:text-gray-700 transition-colors"
          title="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
