'use client';

import { Input, Button } from '@myfood/shared-ui';
import { X } from 'lucide-react';

type TextSearchInputProps = {
    value: string;
    // eslint-disable-next-line no-unused-vars
    onChange: (val: string) => void;
    placeholder?: string;
    name?: string;
};

export function TextSearchInput({ value, onChange, placeholder, name }: TextSearchInputProps) {
    return (
        <div className="relative w-full">
            <Input
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pr-10"
            />

            {value?.length > 0 && (
                <Button
                    type="button"
                    intent="ghost"
                    size="sm"
                    onClick={() => onChange('')}
                    aria-label="Clear search"
                    className="
        absolute right-2 top-1/2 -translate-y-1/2
        h-7 w-7 p-0 
        text-slate-400 hover:text-slate-600
      "
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
