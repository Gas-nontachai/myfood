import { type ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface DialogProps {
  title: string;
  description?: string;
  badge?: string;
  actions?: ReactNode;
  className?: string;
}

export function Dialog({ title, description, badge, actions, className }: DialogProps) {
  return (
    <div className={cn('overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl', className)}>
      <div className="space-y-3 p-6">
        {badge && (
          <p className="inline-flex rounded-full border border-slate-200 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-500">
            {badge}
          </p>
        )}
        <p className="text-lg font-semibold text-slate-900">{title}</p>
        {description && <p className="text-sm text-slate-600">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3 border-t border-slate-100 bg-slate-50 p-4">{actions}</div>}
    </div>
  );
}
