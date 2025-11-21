import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, ...props }, ref) => (
    <label
      className={cn(
        'flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition hover:border-slate-300 focus-within:ring-2 focus-within:ring-brand-primary focus-within:ring-offset-2',
        className
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
        {...props}
      />
      <span>
        <span className="font-semibold">{label}</span>
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </span>
    </label>
  )
);
Checkbox.displayName = 'Checkbox';
