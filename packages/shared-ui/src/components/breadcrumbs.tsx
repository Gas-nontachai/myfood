"use client";

import Link from 'next/link';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';

type BreadcrumbsProps = {
  labelMap?: Record<string, string>;
  rootLabel?: string;
  rootHref?: string;
  className?: string;
};

type PatternEntry = {
  pattern: string;
  label: string;
  regex: RegExp;
};

const ensureLeadingSlash = (value: string) => (value.startsWith('/') ? value : `/${value}`);

const escapeRegexSegments = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildRegexFromPattern = (pattern: string) => {
  const placeholder = pattern.replace(/\[.+?\]/g, '__SEGMENT__');
  const escaped = escapeRegexSegments(placeholder);
  return new RegExp(`^${escaped.replace(/__SEGMENT__/g, '[^/]+')}$`);
};

const formatSegmentLabel = (segment: string) => {
  let decoded = segment;
  try {
    decoded = decodeURIComponent(segment);
  } catch {
    // Fall back to original segment if decoding fails.
  }
  const cleaned = decoded.replace(/[-_]/g, ' ').trim();
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function Breadcrumbs({
  labelMap,
  rootLabel = 'Home',
  rootHref = '/',
  className
}: BreadcrumbsProps) {
  const pathname = usePathname();
  const patternEntries = useMemo<PatternEntry[]>(() => {
    if (!labelMap) {
      return [];
    }
    return Object.entries(labelMap).map(([pattern, value]) => {
      const normalizedPattern = ensureLeadingSlash(pattern);
      return {
        pattern: normalizedPattern,
        label: value,
        regex: buildRegexFromPattern(normalizedPattern)
      };
    });
  }, [labelMap]);

  const segments = (pathname ?? '/').split('/').filter(Boolean);
  let accumulatedPath = '';

  const breadcrumbItems = segments.map((segment) => {
    accumulatedPath += `/${segment}`;
    const directMatch = patternEntries.find((entry) => entry.pattern === accumulatedPath);
    if (directMatch) {
      return { path: accumulatedPath, label: directMatch.label };
    }

    const patternMatch = patternEntries.find((entry) => entry.regex.test(accumulatedPath));

    return {
      path: accumulatedPath,
      label: patternMatch ? patternMatch.label : formatSegmentLabel(segment)
    };
  });

  const items = [
    { path: rootHref, label: rootLabel },
    ...breadcrumbItems
  ];

  const lastIndex = items.length - 1;

  return (
    <nav aria-label="breadcrumb" className={cn('text-xs uppercase tracking-[0.3em] text-slate-400', className)}>
      <ol className="flex flex-wrap items-center gap-2 py-2">
        {items.map((item, index) => (
          <li key={`${item.path}-${index}`} className="flex items-center gap-2">
            {index > 0 && <span className="text-slate-300">/</span>}
            {index < lastIndex ? (
              <Link
                href={{ pathname: item.path }}
                className="text-slate-500 transition-colors hover:text-slate-900"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-slate-900">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
