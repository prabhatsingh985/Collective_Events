import React from 'react';
import { useCollection } from '../context/CollectionContext';
import { CheckCircle2, Heart, Trash2, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCollection();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isRemove = toast.type === 'remove';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all transform translate-y-0 duration-300 ${
              isSuccess
                ? 'bg-slate-900/90 border-emerald-500/40 text-slate-100 shadow-[0_10px_30px_rgba(16,185,129,0.2)]'
                : isRemove
                ? 'bg-slate-900/90 border-rose-500/40 text-slate-100 shadow-[0_10px_30px_rgba(244,63,94,0.2)]'
                : 'bg-slate-900/90 border-amber-500/40 text-slate-100 shadow-[0_10px_30px_rgba(245,158,11,0.2)]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isRemove && <Trash2 className="w-5 h-5 text-rose-400" />}
              {!isSuccess && !isRemove && <Heart className="w-5 h-5 text-amber-400 fill-amber-400/30" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold leading-tight text-white">{toast.title}</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{toast.description}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
