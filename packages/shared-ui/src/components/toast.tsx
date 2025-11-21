import { type ReactNode } from 'react';
import { cn } from '../lib/utils';

const toneStyles: Record<'info' | 'success' | 'warning', string> = {
  info: 'border-slate-200 bg-white text-slate-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900'
};

export interface ToastProps {
  title: string;
  description: string;
  variant?: 'info' | 'success' | 'warning';
  accent?: ReactNode;
  className?: string;
}

export function Toast({ title, description, variant = 'info', accent, className }: ToastProps) {
  return (
    <div className={cn('flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-sm', toneStyles[variant], className)}>
      <div className="mt-1 h-2 w-2 rounded-full bg-current" />
      <div className="flex-1 space-y-0.5">
        <p className="font-semibold">{title}</p>
        <p className="text-xs">{description}</p>
      </div>
      {accent && <div className="text-xs font-semibold text-slate-500">{accent}</div>}
    </div>
  );
}
