import React from 'react';
import { useCollection } from '../context/CollectionContext';
import { CheckCircle2, Heart, Trash2, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCollection();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isRemove = toast.type === 'remove';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-[20px] bg-[#fffef0] text-[#004449] border border-[#004449]/20 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)] transition-all transform translate-y-0 duration-200"
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && (
                <div className="w-6 h-6 rounded-full bg-[#d7ffc2] flex items-center justify-center text-[#004449]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              {isRemove && (
                <div className="w-6 h-6 rounded-full bg-[#fee2e2] flex items-center justify-center text-[#b91c1c]">
                  <Trash2 className="w-4 h-4" />
                </div>
              )}
              {!isSuccess && !isRemove && (
                <div className="w-6 h-6 rounded-full bg-[#e8e6ff] flex items-center justify-center text-[#483cff]">
                  <Heart className="w-4 h-4 fill-current" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold leading-tight text-[#004449]">{toast.title}</h4>
              <p className="text-xs text-[#004449]/70 mt-0.5 leading-relaxed">{toast.description}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-[#004449]/40 hover:text-[#004449] p-1 rounded-full hover:bg-[#d7ffc2]/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
