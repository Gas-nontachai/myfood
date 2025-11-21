import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, className, ...props }, ref) => (
    <label className="block space-y-1 text-sm">
      {label && <span className="text-slate-700 font-semibold">{label}</span>}
      <input
        ref={ref}
        className={cn(
          'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200',
          className
        )}
        {...props}
      />
      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </label>
  )
);
Input.displayName = 'Input';
